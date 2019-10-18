package com.tqhy.client.controllers;

import com.tqhy.client.config.Constants;
import com.tqhy.client.models.entity.DownloadInfo;
import com.tqhy.client.models.entity.SaveDataBody;
import com.tqhy.client.models.entity.SaveDatas;
import com.tqhy.client.models.enums.DownloadTaskApi;
import com.tqhy.client.models.enums.SaveTaskType;
import com.tqhy.client.models.msg.BaseMsg;
import com.tqhy.client.models.msg.local.DownloadMsg;
import com.tqhy.client.models.msg.local.SaveDataMsg;
import com.tqhy.client.models.msg.local.UploadMsg;
import com.tqhy.client.network.Network;
import com.tqhy.client.network.app.JavaAppBase;
import com.tqhy.client.service.HeartBeatService;
import com.tqhy.client.task.DownloadTask;
import com.tqhy.client.task.SaveFileTask;
import com.tqhy.client.utils.FXMLUtils;
import com.tqhy.client.utils.GsonUtils;
import com.tqhy.client.utils.NetworkUtils;
import io.reactivex.Observable;
import io.reactivex.schedulers.Schedulers;
import javafx.application.Platform;
import javafx.beans.property.BooleanProperty;
import javafx.beans.property.SimpleBooleanProperty;
import javafx.concurrent.Worker;
import javafx.scene.CacheHint;
import javafx.scene.control.ButtonType;
import javafx.scene.control.Dialog;
import javafx.scene.image.Image;
import javafx.scene.web.WebEngine;
import javafx.scene.web.WebView;
import javafx.stage.Stage;
import lombok.Getter;
import lombok.Setter;
import netscape.javascript.JSObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import java.io.File;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

/**
 * @author Yiheng
 * @create 3/19/2019
 * @since 1.0.0
 */
@Component
@Getter
@Setter
public class BaseWebviewController {


    Logger logger = LoggerFactory.getLogger(BaseWebviewController.class);
    /**
     * 判断页面是否需要跳转到登录页,与{@link com.tqhy.client.service.HeartBeatService HeartBeatService} 中
     * {@code jumpToLandingFlag} 进行双向绑定
     */
    BooleanProperty jumpToLandingFlag = new SimpleBooleanProperty(false);
    public static BooleanProperty jumpToConnectionFlag = new SimpleBooleanProperty(false);

    @Value("${network.url.landing:''}")
    private String landingUrl;

    @Value("${network.url.connection:''}")
    private String connectionUrl;

    @Autowired
    HeartBeatService heartBeatService;

    @Autowired
    UploadFileController uploadFileController;

    void initialize(WebView webView) {
        initWebView(webView);
        initWebAlert(webView);
        initJumpToLanding(webView);
        initJumpToConnection(webView);
    }

    /**
     * 初始化webView设置与webEngine对象
     */
    public void initWebView(WebView webView) {
        logger.info("into init webEngine..");
        webView.setCache(true);
        webView.setCacheHint(CacheHint.SPEED);
        logger.info("init webView complete..");
    }

    /**
     * 初始化web页面alert事件监听
     */
    private void initWebAlert(WebView webView) {
        webView.getEngine()
               .setOnAlert(event -> {
                   String data = event.getData() + Constants.MSG_SPLITTER;
                   logger.info("alert data is: " + data);

                   String[] split = data.split(Constants.MSG_SPLITTER);
                   switch (split[0]) {
                       case Constants.CMD_MSG_UPLOAD:
                           //alert('upload;case;' + projectId + ';' + projectName)
                           //alert('upload;test;' + taskId + ';' + projectName)

                           String uploadType = split[1];
                           String uploadId = split[2];
                           String uploadTargetName = split[3];
                           uploadFileController.openUpload(UploadMsg.with(uploadType, uploadId, uploadTargetName));
                           break;
                       case Constants.CMD_MSG_DOWNLOAD:
                           //download;{"fileName":"taskName","imgUrlString":"imgUrl1,imgUrl2"}
                           int index = data.indexOf(Constants.MSG_SPLITTER);
                           String jsonStr = data.substring(index + 1);

                           Optional<DownloadInfo> downloadInfoOptional = GsonUtils.parseJsonToObj(jsonStr,
                                                                                                  DownloadInfo.class);
                           onDownloadOption(downloadInfoOptional);
                           break;
                       case Constants.CMD_MSG_SAVE:
                            /*save;{"fileName":"projectName",
                            "head":[{"title":"分类名称","key":"name","__id":"gCYIMF"},{"title":"已标注","key":"value","__id":"gcSMlC"},{"title":"占比","key":"per","__id":"37ZTmj"}],
                            "body":[{"name":"temp","value":2,"per":"8%"},{"name":"牙","value":11,"per":"44%"}]
                            }*/

                           String dataToSave = split[1];

                           Optional<SaveDatas> saveDataOptional = GsonUtils.parseJsonToObj(dataToSave, SaveDatas.class);
                           onSaveDataOption(saveDataOptional);
                           break;
                       case Constants.CMD_MSG_LOGOUT:
                           heartBeatService.stopBeat();
                           logout();
                           break;
                       default:
                           showAlert(data);
                   }
               });
    }


    /**
     * 执行保存指令
     */
    private void onSaveDataOption(Optional<SaveDatas> saveDataOptional) {
        if (saveDataOptional.isPresent()) {
            SaveDatas saveDatas = saveDataOptional.get();
            List<SaveDataBody> body = saveDatas.getBody();

            if (null == body || body.size() == 0) {
                logger.info("save body is empty...");
                return;
            }

            File saveDir = FXMLUtils.chooseDir(null);
            if (null == saveDir) {
                return;
            }

            Observable.fromCallable(
                    SaveFileTask.of(SaveDataMsg.of(SaveTaskType.SAVE_REPORT_TO_CSV, saveDir, saveDatas)))
                      .subscribeOn(Schedulers.io())
                      .observeOn(Schedulers.io())
                      .subscribe(saveDataMsgObservable -> {
                          saveDataMsgObservable.subscribe(saveDataMsg -> {
                              Integer saveFlag = saveDataMsg.getFlag();
                              if (BaseMsg.SUCCESS == saveFlag) {
                                  logger.info("save success");
                                  showAlert("保存完毕");
                              } else {
                                  logger.info("save fail");
                                  showAlert("保存失败");
                              }
                          });
                      });
        } else {
            logger.info("save optional is null");
            showAlert("保存失败");
        }
    }

    /**
     * 执行下载指令
     *
     * @param downloadInfoOptional
     */
    private void onDownloadOption(Optional<DownloadInfo> downloadInfoOptional) {

        if (downloadInfoOptional.isPresent()) {
            DownloadInfo downloadInfo = downloadInfoOptional.get();
            String imgUrlString = downloadInfo.getImgUrlString();
            if (StringUtils.isEmpty(imgUrlString)) {
                logger.info("download img url is empty");
                return;
            }

            File downloadDir = FXMLUtils.chooseDir(null);
            if (null == downloadDir) {
                return;
            }

            Observable.fromCallable(
                    DownloadTask.of(DownloadMsg.of(DownloadTaskApi.DOWNLOAD_PDF, downloadDir, downloadInfo)))
                      .subscribeOn(Schedulers.io())
                      .observeOn(Schedulers.io())
                      .subscribe(downloadMsgObservable ->
                                         downloadMsgObservable.subscribe(downloadMsg -> {
                                             Integer downloadFlag = downloadMsg.getFlag();
                                             if (BaseMsg.SUCCESS == downloadFlag) {
                                                 logger.info("download success");
                                                 showAlert("下载完毕");
                                             } else {
                                                 logger.info("download fail");
                                                 showAlert("下载失败");
                                             }
                                         }));
        } else {
            showAlert("下载失败");
        }
    }

    /**
     * 初始化跳转登录页面逻辑
     */
    private void initJumpToLanding(WebView webView) {
        jumpToLandingFlag.bindBidirectional(heartBeatService.jumpToLandingFlagProperty());
        jumpToLandingFlag.addListener((observable, oldValue, newValue) -> {
            logger.info("jumpToLandingFlag changed,oldValue is: " + oldValue + ", newValue is: " + newValue);
            if (newValue) {
                Platform.runLater(() -> {
                    logger.info("jump to landing");
                    webView.getEngine().load(Network.LOCAL_BASE_URL + landingUrl);
                });
                jumpToLandingFlag.set(false);
            }
        });
    }

    private void initJumpToConnection(WebView webView) {
        heartBeatService.stopBeat();
        jumpToConnectionFlag.addListener((observable, oldValue, newValue) -> {
            logger.info("jumpToLandingFlag changed,oldValue is: " + oldValue + ", newValue is: " + newValue);
            if (newValue) {
                Platform.runLater(() -> {
                    logger.info("jump to landing");
                    webView.getEngine().load(Network.LOCAL_BASE_URL + connectionUrl);
                });
                jumpToConnectionFlag.setValue(false);
            }
        });
    }

    /**
     * alert
     *
     * @param message
     */
    public void showAlert(String message) {
        Platform.runLater(() -> {
            Dialog<ButtonType> alert = new Dialog<>();
            Stage stage = (Stage) alert.getDialogPane().getScene().getWindow();
            stage.getIcons().add(new Image(NetworkUtils.toExternalForm("/static/img/logo_title_light.png")));
            alert.getDialogPane().setContentText(message);
            alert.getDialogPane().getButtonTypes().add(ButtonType.OK);
            alert.showAndWait();
        });
    }


    void loadPage(WebView webView, String url) {
        //url为空则加载默认页面:测试连接页面
        String defaultUrl = Network.LOCAL_BASE_URL + connectionUrl;
        webView.getEngine()
               .load(StringUtils.isEmpty(url) ? defaultUrl : url);
    }

    void engineBindApp(WebView webView, JavaAppBase javaApp) {
        WebEngine engine = webView.getEngine();
        engine.getLoadWorker()
              .stateProperty()
              .addListener((ov, oldState, newState) -> {
                  // logger.info("old state: " + oldState + " ,new state: " + newState);
                  if (Worker.State.FAILED == newState) {
                      JSObject window = (JSObject) engine.executeScript("window");
                      window.setMember("tqClient", javaApp);
                      engine.reload();
                  } else if (Worker.State.SUCCEEDED == newState) {
                      JSObject window = (JSObject) engine.executeScript("window");
                      window.setMember("tqClient", javaApp);
                  }
              });
    }

    void logout() {
        jumpToLandingFlag.set(true);
    }


    /**
     * 向js传值
     *
     * @param msgs
     */
    void sendMsgToJs(WebView webView, String funcName, String... msgs) {
        logger.info("send msg to js func {} with msg {}", funcName, msgs);
        String paramsStr = Arrays.stream(msgs)
                                 .collect(StringBuilder::new,
                                          (builder, msg) -> builder.append("'")
                                                                   .append(msg)
                                                                   .append("'")
                                                                   .append(","),
                                          StringBuilder::append)
                                 .toString();
        paramsStr = paramsStr.substring(0, paramsStr.length() - 1);
        logger.info("paramstr is {}", paramsStr);
        String jsFunStr = funcName + "(" + paramsStr + ")";
        logger.info("jsFunStr is {}", jsFunStr);

        Object response = webView.getEngine()
                                 .executeScript(jsFunStr);
        String s = (String) response;
        logger.info("send msg to js get response: {}", s);
    }
}
