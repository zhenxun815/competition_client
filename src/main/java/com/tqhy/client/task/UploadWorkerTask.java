package com.tqhy.client.task;

import com.tqhy.client.config.Constants;
import com.tqhy.client.models.msg.local.UploadMsg;
import com.tqhy.client.models.msg.server.ClientMsg;
import com.tqhy.client.network.Network;
import com.tqhy.client.utils.FileUtils;
import com.tqhy.client.utils.GsonUtils;
import com.tqhy.client.utils.NetworkUtils;
import com.tqhy.client.utils.StringUtils;
import io.reactivex.Observable;
import io.reactivex.ObservableOnSubscribe;
import io.reactivex.Observer;
import io.reactivex.disposables.Disposable;
import io.reactivex.schedulers.Schedulers;
import javafx.beans.property.BooleanProperty;
import javafx.beans.property.SimpleBooleanProperty;
import javafx.concurrent.Task;
import lombok.*;
import okhttp3.MultipartBody;
import okhttp3.RequestBody;
import okhttp3.ResponseBody;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.File;
import java.text.DecimalFormat;
import java.util.*;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;

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
    BooleanProperty jumpToLandFlag = new SimpleBooleanProperty(false);
    BooleanProperty stopUploadFlag = new SimpleBooleanProperty(false);

    @NonNull
    File dirToUpload;

    @NonNull
    UploadMsg uploadMsg;

    @NonNull
    String localDataPath;

    @NonNull
    int maxUploadCaseCount;

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

        boolean prepareTask = prepareTask();
        if (!prepareTask) {
            return null;
        }

        if (total2Upload == 0) {
            logger.info("total2Upload file count is 0!");
            updateProgress(100, 100);
            String completeMsg = PROGRESS_MSG_COMPLETE + ";" + successCount.get() + ";" + failCount.get();
            updateMessage(completeMsg);
        }

        logger.info("total2Upload file count is: " + total2Upload);

        String uploadType = uploadMsg.getUploadType();

        if (UploadMsg.UPLOAD_TYPE_CASE.equals(uploadType)) {
            uploadCase(uploadMsg);
        } else if (UploadMsg.UPLOAD_TYPE_TEST.equals(uploadType)) {
            uploadTest(uploadMsg);
            /*ResponseBody body = Network.getAicApi()
                                       .uploadTestEnd(uploadMsg.getBatchNumber())
                                       .execute()
                                       .body();
            String uploadEndRes = body.string();
            logger.info("uploadEndRes is {}", uploadEndRes);*/
        }

        return null;
    }

    private boolean prepareTask() {
        successCount = new AtomicInteger(0);
        failCount = new AtomicInteger(0);
        uploadInfoFile = FileUtils.getLocalFile(localDataPath, uploadMsg.getBatchNumber() + ".txt");
        jpgDir = new File(dirToUpload, Constants.PATH_TEMP_JPG);
        if (jpgDir.exists()) {
            FileUtils.deleteDir(jpgDir);
        }

        HashMap<File, String> tempTotalFile = collectAll(dirToUpload);
        ArrayList<String> invalisdDirPaths = new ArrayList<>();
        tempTotalFile.forEach((file, caseName) -> {
            if (Constants.CASE_NAME_INVALID.equals(caseName)) {
                invalisdDirPaths.add(file.getAbsolutePath());
                FileUtils.writeFile(uploadInfoFile,
                                    file.getAbsolutePath(),
                                    builder -> builder.append(Constants.NEW_LINE),
                                    true,
                                    false);
            }
        });
        if (invalisdDirPaths.size() > 0) {
            updateMessage(PROGRESS_MSG_COLLECT + ";invalid;" + invalisdDirPaths.size());
            return false;
        }
        List<String> caseNames = tempTotalFile.values()
                                              .stream()
                                              .distinct()
                                              .collect(Collectors.toList());


        if (maxUploadCaseCount > 0 && maxUploadCaseCount < caseNames.size()) {
            HashMap<File, String> tempUploadFile = new HashMap<>();
            List<String> uploadCaseNames = caseNames.stream()
                                                    .limit(maxUploadCaseCount)
                                                    .collect(Collectors.toList());
            logger.info("upload case count is: {}", uploadCaseNames.size());

            tempTotalFile.forEach((file, caseName) -> {
                if (uploadCaseNames.contains(caseName)) {
                    tempUploadFile.put(file, caseName);
                }
            });

           /* tempUploadFile.forEach((file, caseName) -> {
                logger.info("file {} case name {}", file.getAbsolutePath(), caseName);
            });*/
            total2Transform = tempUploadFile.values().size();
            uploadImgFileMap = transAllToJpg(tempUploadFile, jpgDir);

        } else {
            total2Transform = tempTotalFile.values().size();
            uploadImgFileMap = transAllToJpg(tempTotalFile, jpgDir);
        }
        total2Upload = uploadImgFileMap.values().size();
        stopUploadFlag.setValue(false);
        return true;
    }


    /**
     * 上传测试数据
     *
     * @param uploadMsg
     */
    private void uploadTest(UploadMsg uploadMsg) {

        String token = uploadMsg.getToken();
        String batchNumber = uploadMsg.getBatchNumber();
        String dirPathToUpload = dirToUpload.getAbsolutePath();

        HashMap<String, String> requestParamMap = new HashMap<>();
        requestParamMap.put("token", token);
        requestParamMap.put("batchNumber", batchNumber);
        requestParamMap.put("taskId", uploadMsg.getUploadId());
        requestParamMap.put("name", dirToUpload.getName());

        logger.info("upload token: {}, dirToUpload: {}, batchNumber: {}", token, dirPathToUpload, batchNumber);
        upLoadDir(requestParamMap);
    }

    /**
     * 上传病例数据
     *
     * @param uploadMsg
     */
    private void uploadCase(UploadMsg uploadMsg) {

        String token = uploadMsg.getToken();
        String batchNumber = uploadMsg.getBatchNumber();
        String dirPathToUpload = dirToUpload.getAbsolutePath();

        HashMap<String, String> requestParamMap = new HashMap<>();
        requestParamMap.put("token", uploadMsg.getToken());
        requestParamMap.put("batchNumber", uploadMsg.getBatchNumber());
        requestParamMap.put("projectId", uploadMsg.getUploadId());
        requestParamMap.put("remarks", uploadMsg.getRemarks());
        requestParamMap.put("name", dirToUpload.getName());

        logger.info("upload token: {}, dirToUpload: {}, batchNumber: {}", token, dirPathToUpload, batchNumber);
        upLoadDir(requestParamMap);
    }

    private void upLoadDir(HashMap<String, String> requestParamMap) {
        for (Map.Entry<File, String> uploadFileEntry : uploadImgFileMap.entrySet()) {
            File file = uploadFileEntry.getKey();
            String caseName = uploadFileEntry.getValue();
            if (shouldStop()) {
                logger.info("upload dir should stop...");
                return;
            }
            requestParamMap.put("caseName", caseName);
            logger.info("case name is: {}", caseName);
            Map<String, RequestBody> requestMap = NetworkUtils.createRequestParamMap(requestParamMap);
            doUpLoad(file, requestMap);
        }

    }

    private void doUpLoad(File fileToUpload, Map<String, RequestBody> requestParamMap) {

        logger.info("start upload file: " + fileToUpload.getAbsolutePath());
        if (shouldStop()) {
            logger.info("do upload should stop...");
            return;
        }
        MultipartBody.Part filePart = NetworkUtils.createFilePart("file", fileToUpload.getAbsolutePath());
        Observable<ResponseBody> resObservable = null;

        if (UploadMsg.UPLOAD_TYPE_TEST.equals(uploadMsg.getUploadType())) {
            resObservable = Network.getAicApi().uploadTestFiles(requestParamMap, filePart);
        } else if (UploadMsg.UPLOAD_TYPE_CASE.equals(uploadMsg.getUploadType())) {
            resObservable = Network.getAicApi().uploadFiles(requestParamMap, filePart);
        }

        resObservable.observeOn(Schedulers.io())
                     .subscribeOn(Schedulers.trampoline())
                     .blockingSubscribe(new UploadObserver(fileToUpload));
    }

    /**
     * 更新上传状态
     */
    private void updateUploadStatus() {
        int completeCount = successCount.get() + failCount.get();
        double progress = (completeCount + 0D) / total2Upload * 100;
        logger.info("complete count is: " + completeCount + ", progress is: " + progress);
        updateProgress(completeCount, total2Upload);

        int transformFailCount = total2Transform - total2Upload;
        int totalFailCount = failCount.get() + transformFailCount;
        String completeMsg = PROGRESS_MSG_COMPLETE + ";" + successCount.get() + ";" + totalFailCount;
        String uploadMsg = PROGRESS_MSG_UPLOAD + ";" + progress;
        updateMessage(progress == 100.0D ? completeMsg : uploadMsg);
        deleteTempFiles(completeCount);
    }

    /**
     * 删除生成的临时jpg文件
     */
    private void deleteTempFiles(int completeCount) {

        if (completeCount == total2Upload) {
            FileUtils.deleteDir(jpgDir);
        }
    }

    private AtomicInteger fakeUpload(File caseDir) {
        String libPath = System.getProperty("java.library.path");
        logger.info("lib path: is: " + libPath);

        HashMap<File, String> filesMapInDir = FileUtils.getFilesMapInRootDir(caseDir, file -> FileUtils.isJpgFile(
                file) || isDcmFile(file));
        HashMap<File, String> transformedFilesMap = transAllToJpg(filesMapInDir, jpgDir);
        logger.info("into fakeUpload...");
        AtomicInteger completeCount = new AtomicInteger(0);
        int total = transformedFilesMap.values().size();

        transformedFilesMap.forEach((file, caseName) ->
                                            Observable.create((ObservableOnSubscribe<File>) emitter -> {
                                                                  emitter.onNext(file);
                                                                  emitter.onComplete();
                                                              }
                                                             ).observeOn(Schedulers.io())
                                                      .subscribeOn(Schedulers.single())
                                                      .blockingSubscribe(new Observer<File>() {
                                                          @Override
                                                          public void onSubscribe(Disposable d) {
                                                              logger.info("Disposable: " + d);
                                                          }

                                                          @Override
                                                          public void onNext(File file) {
                                                              try {
                                                                  Thread.sleep(2000);
                                                                  logger.info(file.getAbsolutePath() + " uploading...");
                                                              } catch (InterruptedException e) {
                                                                  e.printStackTrace();
                                                              }
                                                          }

                                                          @Override
                                                          public void onError(Throwable e) {
                                                              failCount.incrementAndGet();
                                                              e.printStackTrace();
                                                          }

                                                          @Override
                                                          public void onComplete() {
                                                              completeCount.incrementAndGet();
                                                              updateProgress(completeCount.get(), total);
                                                              double progress = (completeCount.get() + failCount.get() + 0D) / total * 100;
                                                              logger.info(
                                                                      "complete count is: " + completeCount.get() + ", progress is: " + progress);
                                                              updateMessage(
                                                                      progress == 100.0D ? PROGRESS_MSG_COMPLETE : DecimalFormat
                                                                              .getInstance()
                                                                              .format(progress));
                                                          }
                                                      }));

        return completeCount;
    }

    /**
     * 收集全部文件信息并更新进度条状态
     *
     * @param dirToUpload
     * @return
     */
    private HashMap<File, String> collectAll(File dirToUpload) {
        AtomicInteger completeCount = new AtomicInteger(0);
        AtomicInteger maxCount = new AtomicInteger(200);
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
        String uploadMsg = PROGRESS_MSG_COLLECT + ";progress;" + progress;
        updateMessage(uploadMsg);
    }

    /**
     * 统一所有待上传图片数据为JPG格式
     *
     * @param originFiles
     * @return
     */
    private HashMap<File, String> transAllToJpg(HashMap<File, String> originFiles, File jpgDir) {
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
        if (isDcmFile(file)) {
            File jpgCaseDir = new File(jpgDir, caseName);
            Optional<File> jpgFileOpt = transToJpg(file, jpgCaseDir);
            if (jpgFileOpt.isPresent()) {
                map.put(jpgFileOpt.get(), caseName);
            } else {
                FileUtils.appendFile(uploadInfoFile, file.getAbsolutePath(),
                                     builder -> builder.append(Constants.NEW_LINE), true);
            }
        } else {
            map.put(file, caseName);
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
        if (stopUploadFlag.get() || jumpToLandFlag.get()) {
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


    private class UploadObserver implements Observer<ResponseBody> {
        Disposable d;
        File fileToUpload;

        public UploadObserver(File fileToUpload) {
            this.fileToUpload = fileToUpload;
        }

        @Override
        public void onSubscribe(Disposable d) {
            logger.info("on subscribe Disposable: " + d);
            if (shouldStop()) {
                logger.info("on subscribe should stop {}", d);
                d.dispose();
            }
            this.d = d;
        }

        @Override
        public void onNext(ResponseBody responseBody) {
            ClientMsg clientMsg = GsonUtils.parseResponseToObj(responseBody);
            Integer flag = clientMsg.getFlag();

            logger.info("upload onnext flag is {}", flag);
            if (shouldStop()) {
                logger.info("on next should stop..");
                d.dispose();
                logger.info("start delete tmp file...");
                File temp = new File(dirToUpload, Constants.PATH_TEMP_JPG);
                FileUtils.deleteDir(temp);
                @NonNull String uploadType = uploadMsg.getUploadType();
                String batchNumber = uploadMsg.getBatchNumber();
                logger.info("delBatch request batch number{}, uploadType{}", batchNumber, uploadType);
                Network.getAicApi()
                       .delBatch(batchNumber, uploadType)
                       .observeOn(Schedulers.io())
                       .subscribeOn(Schedulers.trampoline())
                       .subscribe(resBody -> {
                           String jsonStr = resBody.string();
                           logger.info("delBatch response batch number {},response str {}", batchNumber, jsonStr);
                       });
            }
            if (203 == flag) {
                jumpToLandFlag.set(true);
            }
            if (2 == flag) {
                List<String> msgs = clientMsg.getMsg();

                String failInfo = StringUtils.join(msgs, ",",
                                                   msg -> "已存在".equals(msg) ? ";1" : msg);
                String resMsg = fileToUpload.getAbsolutePath().concat(failInfo);
                logger.info("server get file fail...{}", resMsg);
                failCount.incrementAndGet();
                successCount.decrementAndGet();
                FileUtils.appendFile(uploadInfoFile, resMsg,
                                     builder -> builder.append(Constants.NEW_LINE), true);
            }
        }

        @Override
        public void onError(Throwable e) {
            logger.error("upload " + fileToUpload.getAbsolutePath() + " failed", e);
            failCount.incrementAndGet();
            updateUploadStatus();
            FileUtils.appendFile(uploadInfoFile, fileToUpload.getAbsolutePath(),
                                 builder -> builder.append(Constants.NEW_LINE), true);
        }

        @Override
        public void onComplete() {
            successCount.incrementAndGet();
            updateUploadStatus();
        }
    }
}
