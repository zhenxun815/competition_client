package com.tqhy.client.task;

import com.google.gson.Gson;
import com.tqhy.client.models.entity.Case;
import com.tqhy.client.models.entity.OriginData;
import com.tqhy.client.utils.Dcm2JpgUtil;
import com.tqhy.client.utils.FileUtils;
import com.tqhy.client.utils.PrimaryKeyUtil;
import com.tqhy.client.utils.PropertyUtils;
import javafx.beans.property.BooleanProperty;
import javafx.beans.property.SimpleBooleanProperty;
import javafx.concurrent.Task;
import lombok.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.File;
import java.util.ArrayList;
import java.util.List;

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
    public static final String PROGRESS_MSG_TRANS = "trans";
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
     * 上传成功文件数
     */

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
        uploadInfoFile = FileUtils.getLocalFile(localDataPath, batchNumber + ".txt");
        String jpgDirPath = PropertyUtils.getProperty("jpgDir");
        this.jpgDir = new File(jpgDirPath);
        if (jpgDir.exists()) {
            FileUtils.deleteDir(jpgDir);
        }


        originCases = collectAll(dirToUpload);
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
    private ArrayList<Case> collectAll(File dirToUpload) {
        File[] caseDirs = dirToUpload.listFiles(File::isDirectory);
        ArrayList<Case> cases = new ArrayList<>();

        for (File caseDir : caseDirs) {
            File[] dcmFiles = caseDir.listFiles();
            int completeCount = 0;
            int total2Transform = dcmFiles.length;
            String caseDirName = caseDir.getName();
            String caseId = PrimaryKeyUtil.getMd5(caseDirName);
            logger.info("caseDirName is #{}#,caseId is #{}#", caseDirName, caseId);
            File destJpgDir = new File(jpgDir, caseId);
            if (!destJpgDir.exists()) {
                destJpgDir.mkdirs();
            }
            ArrayList<OriginData> originDatas = new ArrayList<>();
            for (File dcmFile : dcmFiles) {
                File jpgFile = Dcm2JpgUtil.convert(dcmFile, destJpgDir);
                completeCount += 1;
                updateTransImgStatus(completeCount, total2Transform);
                if (null != jpgFile) {
                    //logger.info("convert {} complete...", jpgFile.getAbsolutePath());

                    OriginData originData = FileUtils.getOriginData(jpgFile);
                    //OriginData originData = OriginData.of("tt", 0, 0, "pp");
                    originDatas.add(originData);
                }
            }
            logger.info("convert dir #{}# complete..", caseDirName);
            cases.add(Case.of(caseId, caseDirName, originDatas));
        }


        return cases;
    }


    /**
     * 更新图片格式转换进度状态
     */
    private void updateTransImgStatus(int completeCount, int total2Transform) {
        double progress = (completeCount + 0D) / total2Transform * 100;
        String uploadMsg = PROGRESS_MSG_TRANS + ";progress;" + progress;
        updateMessage(uploadMsg);
        updateProgress(completeCount, total2Transform);
    }

    private boolean shouldStop() {
        if (stopUploadFlag.get()) {
            logger.info("should stop..");
            return true;
        }
        return false;
    }

}
