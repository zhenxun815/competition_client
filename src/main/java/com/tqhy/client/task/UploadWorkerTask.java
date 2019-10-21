package com.tqhy.client.task;

import com.tqhy.client.config.Constants;
import com.tqhy.client.utils.FileUtils;
import javafx.beans.property.BooleanProperty;
import javafx.beans.property.SimpleBooleanProperty;
import javafx.concurrent.Task;
import lombok.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.File;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
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
public class UploadWorkerTask extends Task {

    public static final String PROGRESS_MSG_ERROR = "error";
    public static final String PROGRESS_MSG_COMPLETE = "complete";
    public static final String PROGRESS_MSG_UPLOAD = "upload";
    public static final String PROGRESS_MSG_COLLECT = "collect";

    Logger logger = LoggerFactory.getLogger(UploadWorkerTask.class);
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
     * 待上传总文件数
     */
    int total2Upload;

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
    private HashMap<File, String> uploadImgFileMap;
    private File jpgDir;

    @Override
    protected Object call() throws Exception {
        logger.info("start upload task...");

        prepareTask();
        String uploadMsg = PROGRESS_MSG_COMPLETE + ";" + successCount.get() + ";" + failCount.get();
        updateMessage(uploadMsg);
        return null;
    }

    private boolean prepareTask() {
        successCount = new AtomicInteger(0);
        failCount = new AtomicInteger(0);
        uploadInfoFile = FileUtils.getLocalFile(localDataPath, batchNumber + ".txt");
        jpgDir = new File(dirToUpload, Constants.PATH_TEMP_JPG);
        if (jpgDir.exists()) {
            FileUtils.deleteDir(jpgDir);
        }

        HashMap<File, String> tempTotalFile = collectAll(dirToUpload);
        ArrayList<String> invalidDirPaths = new ArrayList<>();
        tempTotalFile.forEach((file, caseName) -> {
            if (Constants.CASE_NAME_INVALID.equals(caseName)) {
                invalidDirPaths.add(file.getAbsolutePath());
                FileUtils.writeFile(uploadInfoFile,
                                    file.getAbsolutePath(),
                                    builder -> builder.append(Constants.NEW_LINE),
                                    true,
                                    false);
            }
        });
        if (invalidDirPaths.size() > 0) {
            updateMessage(PROGRESS_MSG_COLLECT + ";invalid;" + invalidDirPaths.size());
            return false;
        }


        total2Transform = tempTotalFile.values().size();
        uploadImgFileMap = transAllToJpg(tempTotalFile);

        total2Upload = uploadImgFileMap.values().size();
        stopUploadFlag.setValue(false);
        return true;
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
        boolean fileValid = isDcmFile(file) || FileUtils.isJpgFile(file);
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
    private HashMap<File, String> transAllToJpg(HashMap<File, String> originFiles) {
        AtomicInteger completeCount = new AtomicInteger(0);
        HashMap<File, String> jpgFileMap = originFiles.entrySet()
                                                      .stream()
                                                      .collect(HashMap::new,
                                                               (map, entry) -> {
                                                                   if (shouldStop()) {
                                                                       return;
                                                                   }
                                                                   putTransedFile2Map(jpgDir, map, entry);
                                                                   updateTransImgStatus(completeCount, total2Transform);
                                                               },
                                                               HashMap::putAll);


        return jpgFileMap;
    }

    private void putTransedFile2Map(File jpgDir, HashMap<File, String> map, Map.Entry<File, String> entry) {
        File file = entry.getKey();
        String caseName = entry.getValue();
        File jpgCaseDir = new File(jpgDir, caseName);
        boolean add;
        File file2add;
        if (isDcmFile(file)) {
            Optional<File> jpgFileOpt = transToJpg(file, jpgCaseDir);
            add = jpgFileOpt.isPresent();
            file2add = add ? jpgFileOpt.get() : null;
        } else {
            file2add = new File(jpgCaseDir, file.getName());
            add = FileUtils.copyFile(file, file2add);
        }

        if (add) {
            successCount.incrementAndGet();
            map.put(file2add, caseName);
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
        total2Upload = 0;
        total2Transform = 0;
        successCount.set(0);
        failCount.set(0);
    }

}
