package com.tqhy.client.task;

import com.google.gson.Gson;
import com.tqhy.client.config.Constants;
import com.tqhy.client.models.entity.Case;
import com.tqhy.client.models.entity.OriginData;
import com.tqhy.client.utils.FileUtils;
import javafx.beans.property.BooleanProperty;
import javafx.beans.property.SimpleBooleanProperty;
import javafx.concurrent.Task;
import lombok.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.File;
import java.util.*;
import java.util.concurrent.atomic.AtomicInteger;

import static com.tqhy.client.utils.FileUtils.isDcmFile;
import static com.tqhy.client.utils.FileUtils.transToJpg;

/**
 * @author Yiheng
 * @create 4/1/2019
 * @since 1.0.0
 */
@Getter
@Setter
@NoArgsConstructor
@RequiredArgsConstructor(staticName = "with")
public class DcmTransWorkerTask extends Task {

    public static final String PROGRESS_MSG_ERROR = "error";
    public static final String PROGRESS_MSG_COMPLETE = "complete";
    public static final String PROGRESS_MSG_UPLOAD = "upload";
    public static final String PROGRESS_MSG_COLLECT = "collect";

    Logger logger = LoggerFactory.getLogger(DcmTransWorkerTask.class);
    BooleanProperty stopUploadFlag = new SimpleBooleanProperty(false);

    @NonNull
    File dirToUpload;

    @NonNull
    String localDataPath;

    @NonNull
    String batchNumber;
    /**
     * 待转换总文件数
     */
    int total2Transform;

    /**
     * 上传成功文件数
     */
    AtomicInteger successCount;

    /**
     * 上传失败文件数
     */
    AtomicInteger failCount;

    /**
     * 本次上传任务信息记录文件
     */
    File uploadInfoFile;
    private List<Case> originCases;
    private File jpgDir;

    @Override
    protected Object call() throws Exception {
        logger.info("start upload task...");

        List<Case> cases = prepareTask();
        String caseJson = new Gson().toJson(cases);
        String uploadMsg = PROGRESS_MSG_COMPLETE + ";" + caseJson;
        updateMessage(uploadMsg);
        return null;
    }

    private List<Case> prepareTask() {
        successCount = new AtomicInteger(0);
        failCount = new AtomicInteger(0);
        uploadInfoFile = FileUtils.getLocalFile(localDataPath, batchNumber + ".txt");
        jpgDir = new File(dirToUpload, Constants.PATH_TEMP_JPG);
        if (jpgDir.exists()) {
            FileUtils.deleteDir(jpgDir);
        }

        HashMap<File, String> tempTotalFile = collectAll(dirToUpload);

        total2Transform = tempTotalFile.values().size();
        originCases = transAllToJpg(tempTotalFile);

        stopUploadFlag.setValue(false);
        return originCases;
    }


    /**
     * 删除生成的临时jpg文件
     */
    private void deleteTempFiles() {
        FileUtils.deleteDir(jpgDir);
    }


    /**
     * 收集全部文件信息并更新进度条状态
     *
     * @param dirToUpload
     * @return
     */
    private HashMap<File, String> collectAll(File dirToUpload) {
        AtomicInteger completeCount = new AtomicInteger(0);
        AtomicInteger maxCount = new AtomicInteger(1500);
        HashMap<File, String> directImgFileMap = FileUtils.getFilesMapInRootDir(dirToUpload,
                                                                                file -> filesFilter(completeCount,
                                                                                                    maxCount, file));

        HashMap<File, String> subDirImgFileMap = FileUtils.getFilesMapInSubDir(dirToUpload,
                                                                               file -> filesFilter(completeCount,
                                                                                                   maxCount, file),
                                                                               dirToUpload);
        HashMap<File, String> tempTotalFile = new HashMap<>();
        tempTotalFile.putAll(directImgFileMap);
        tempTotalFile.putAll(subDirImgFileMap);

        return tempTotalFile;
    }

    /**
     * 待收集文件过滤条件
     *
     * @param completeCount
     * @param maxCount
     * @param file
     * @return
     */
    private boolean filesFilter(AtomicInteger completeCount, AtomicInteger maxCount, File file) {
        boolean fileValid = isDcmFile(file);
        updateCollectAllStatus(completeCount, maxCount);
        return fileValid;
    }

    /**
     * 更新文件信息收集状态
     *
     * @param completeCount
     * @param maxCount
     */
    private void updateCollectAllStatus(AtomicInteger completeCount, AtomicInteger maxCount) {
        if (completeCount.get() > maxCount.get() - 100) {
            maxCount.addAndGet(200);
        }
        double progress = (completeCount.incrementAndGet() + 0D) / maxCount.get() * 100;
        updateProgress(completeCount.get(), maxCount.get());
        String uploadMsg = PROGRESS_MSG_COLLECT + ";collect;" + progress;
        updateMessage(uploadMsg);
    }

    /**
     * 统一所有待上传图片数据为JPG格式
     *
     * @param originFiles
     * @return
     */
    private List<Case> transAllToJpg(HashMap<File, String> originFiles) {
        AtomicInteger completeCount = new AtomicInteger(0);
        ArrayList<Case> cases = new ArrayList<>();
        HashMap<String, List<OriginData>> caseMap = originFiles.entrySet()
                                                               .stream()
                                                               .collect(HashMap::new,
                                                                        (map, entry) -> {
                                                                            if (shouldStop()) {
                                                                                return;
                                                                            }
                                                                            putTransedFile2Map(jpgDir, map, entry);
                                                                            updateTransImgStatus(completeCount,
                                                                                                 total2Transform);
                                                                        },
                                                                        HashMap::putAll);
        caseMap.forEach((caseId, dataList) -> cases.add(Case.of(caseId, dataList)));

        return cases;
    }

    private void putTransedFile2Map(File jpgDir, HashMap<String, List<OriginData>> map, Map.Entry<File, String> entry) {
        File file = entry.getKey();
        String caseId = entry.getValue();
        File jpgCaseDir = new File(jpgDir, caseId);

        if (!jpgCaseDir.exists()) {
            jpgCaseDir.mkdirs();
        }
        Optional<File> jpgFileOpt = transToJpg(file, jpgCaseDir);
        if (jpgFileOpt.isPresent()) {

            File file2add = jpgFileOpt.get();
            OriginData originData = FileUtils.getOriginData(file2add);
            map.computeIfPresent(caseId, (k, v) -> {
                v.add(originData);
                return v;
            });

            map.computeIfAbsent(caseId, k -> {
                ArrayList<OriginData> list = new ArrayList<>();
                list.add(originData);
                return list;
            });

            successCount.incrementAndGet();
        } else {
            failCount.incrementAndGet();
            FileUtils.appendFile(uploadInfoFile, file.getAbsolutePath(),
                                 builder -> builder.append(Constants.NEW_LINE), true);
        }
    }

    /**
     * 更新图片格式转换进度状态
     *
     * @param completeCount
     * @param total2Transform
     */
    private void updateTransImgStatus(AtomicInteger completeCount, int total2Transform) {
        double progress = (completeCount.incrementAndGet() + 0D) / total2Transform * 100;
        updateProgress(completeCount.get(), total2Transform);
        String uploadMsg = PROGRESS_MSG_COLLECT + ";progress;" + progress;
        updateMessage(uploadMsg);
    }

    private boolean shouldStop() {
        if (stopUploadFlag.get()) {
            logger.info("should stop..");
            initValues();
            return true;
        }
        return false;
    }

    /**
     * 初始化数据
     */
    private void initValues() {
        total2Transform = 0;
        successCount.set(0);
        failCount.set(0);
    }

}
