package com.tqhy.client.controllers;

import com.tqhy.client.ClientApplication;
import com.tqhy.client.config.Constants;
import com.tqhy.client.models.msg.local.UploadMsg;
import com.tqhy.client.network.Network;
import com.tqhy.client.task.DcmTransWorkerTask;
import com.tqhy.client.utils.FXMLUtils;
import com.tqhy.client.utils.FileUtils;
import com.tqhy.client.utils.PropertyUtils;
import javafx.application.Platform;
import javafx.beans.property.BooleanProperty;
import javafx.beans.property.SimpleBooleanProperty;
import javafx.fxml.FXML;
import javafx.geometry.Rectangle2D;
import javafx.scene.control.Button;
import javafx.scene.control.Label;
import javafx.scene.control.ProgressBar;
import javafx.scene.control.ScrollPane;
import javafx.scene.input.MouseButton;
import javafx.scene.input.MouseEvent;
import javafx.scene.layout.HBox;
import javafx.scene.layout.VBox;
import javafx.scene.text.Text;
import javafx.stage.DirectoryChooser;
import javafx.stage.Screen;
import javafx.stage.Stage;
import javafx.stage.StageStyle;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.*;
import java.text.DecimalFormat;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

/**
 * @author Yiheng
 * @create 3/22/2019
 * @since 1.0.0
 */
@RestController
public class UploadFileController {


    public VBox choose_right;
    Logger logger = LoggerFactory.getLogger(UploadFileController.class);
    Stage stage;


    /**
     * 主窗口是否最小化
     */
    BooleanProperty mainStageIconified = new SimpleBooleanProperty();

    /**
     * 本次导入信息
     */
    private UploadMsg uploadMsg;

    /**
     * 待导入文件夹
     */
    private File dirToUpload;


    @Value("${path.data:'/data/'}")
    private String localDataPath;
    @FXML
    HBox container_pane;
    @FXML
    VBox panels_parent;
    @FXML
    VBox panel_choose;
    @FXML
    VBox panel_progress;
    @FXML
    VBox panel_complete;
    @FXML
    VBox panel_fail;

    /**
     * 选择导入文件提示
     * 未选择显示:未选择任何文件;已选择显示:选择文件夹的全路径
     */
    @FXML
    Text text_choose_info;

    /**
     * 失败提示信息标题
     */
    @FXML
    public Text text_fail_title;
    /**
     * 不合法信息展示滚动页面
     */
    @FXML
    public ScrollPane scrollPane;

    /**
     * 不合法信息
     */
    @FXML
    public Label label_fail_desc;
    /**
     * 导入进度百分比
     */
    @FXML
    Text text_progress_info;
    /**
     * 进度条界面描述信息
     */
    @FXML
    public Text text_progress_desc;

    /**
     * 长传完毕显示提示内容
     */
    @FXML
    Text text_success_desc;
    /**
     * 导入进度条
     */
    @FXML
    ProgressBar progress_bar_upload;

    /**
     * 窗口最小化
     */
    @FXML
    public Button btn_upload_min;

    @FXML
    HBox box_complete;

    @Autowired
    LandingController landingController;

    private DcmTransWorkerTask workerTask;

    private String caseJson;

    private VBox[] panels;

    @FXML
    public void initialize() {
        stage.setResizable(false);
        stage.initStyle(StageStyle.TRANSPARENT);
        stage.setAlwaysOnTop(true);
        Rectangle2D visualBounds = Screen.getPrimary().getVisualBounds();

        stage.setWidth(visualBounds.getWidth());
        stage.setHeight(visualBounds.getHeight());

        btn_upload_min.setLayoutX(visualBounds.getWidth() - 50);
        btn_upload_min.setLayoutY(16);
        stage.centerOnScreen();
        panels = new VBox[]{panel_choose, panel_progress, panel_fail, panel_complete};
        showPanel(panel_choose.getId());


        stage.iconifiedProperty()
             .addListener((observable, oldVal, newVal) -> {
                 //logger.info("main stage iconified state change..." + newVal);
                 ClientApplication.stage.setIconified(newVal);
             });

        //mainStageIconified.bind(ClientApplication.stage.iconifiedProperty());
        ClientApplication.stage.iconifiedProperty()
                               .addListener((observable, oldVal, newVal) -> {
                                   logger.info("main stage iconified state change..." + newVal);
                                   stage.setIconified(newVal);
                                   //ClientApplication.stage.setIconified(newVal);
                               });


        scrollPane.setFitToWidth(true);
        label_fail_desc.setWrapText(true);
    }

    /**
     * 数据重置
     */
    private void resetValues() {
        dirToUpload = null;
        text_choose_info.setText("未选择任何文件!");
    }


    /**
     * 选择待导入文件夹
     *
     * @param mouseEvent
     */
    @FXML
    public void chooseDirectory(MouseEvent mouseEvent) {
        MouseButton button = mouseEvent.getButton();
        if (MouseButton.PRIMARY.equals(button)) {
            logger.info(button.name() + "....");
            DirectoryChooser directoryChooser = new DirectoryChooser();
            dirToUpload = directoryChooser.showDialog(stage);

            if (null != dirToUpload) {
                File[] files = dirToUpload.listFiles();

                if (null == files || files.length == 0) {
                    logger.info("choose dirToUpload error");
                    text_choose_info.setText("文件夹路径不合法!");
                } else {
                    logger.info("choose dirToUpload is: [{}]", dirToUpload.getAbsolutePath());
                    text_choose_info.setText(dirToUpload.getAbsolutePath());
                }
            }
        }
    }

    /**
     * 开始导入
     *
     * @param mouseEvent
     */
    @FXML
    public void startUpload(MouseEvent mouseEvent) throws ExecutionException, InterruptedException {
        MouseButton button = mouseEvent.getButton();
        if (MouseButton.PRIMARY.equals(button)) {
            logger.info(button.name() + "....");
            if (null == dirToUpload) {
                return;
            }


            logger.info("dir to upload: {}", dirToUpload.getAbsolutePath());

            //显示导入中界面
            showPanel(panel_progress.getId());
            text_progress_info.setText(0.00 + "%");
            uploadMsg.setRemarks("remarks");
            String batchNumber = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmssSSS"));

            workerTask = DcmTransWorkerTask.with(dirToUpload, localDataPath, batchNumber);

            workerTask.messageProperty()
                      .addListener((observable, oldVal, newVal) -> {
                          DecimalFormat decimalFormat = new DecimalFormat("#0.0");
                          logger.info("upload progress msg..." + newVal);
                          String[] msgSplit = newVal.split(";");
                          switch (msgSplit[0]) {
                              case DcmTransWorkerTask.PROGRESS_MSG_COMPLETE:
                                  //显示导入成功页面
                                  showPanel(panel_complete.getId());
                                  String completeMsg = "数据导入完毕!";
                                  text_success_desc.setText(completeMsg);
                                  caseJson = msgSplit[1];
                                  logger.info("case json is {}", caseJson);
                                  break;
                              case DcmTransWorkerTask.PROGRESS_MSG_TRANS:
                                  text_progress_desc.setText("文件信息导入中,请耐心等待..");
                                  double collectProcess = Double.parseDouble(msgSplit[2]);
                                  logger.info("collect process is {}", collectProcess);
                                  text_progress_info.setText(decimalFormat.format(collectProcess) + "%");
                                  break;
                          }
                      });

            progress_bar_upload.progressProperty()
                               .bind(workerTask.progressProperty());

            ExecutorService executor = Executors.newSingleThreadExecutor();
            executor.submit(workerTask);

        }
    }

    /**
     * 显示对应界面
     *
     * @param panelId 待显示界面的id
     */
    private void showPanel(String panelId) {

        FXMLUtils.center2Display(container_pane);
        panels_parent.getChildren().removeAll(panels);
        VBox panelToShow = Arrays.stream(panels)
                                 .filter(panel -> panel.getId().equals(panelId))
                                 .findFirst()
                                 .get();


        panels_parent.getChildren()
                     .add(panelToShow);
    }


    /**
     * 取消导入,导入成功确认按钮与导入失败取消按钮亦调用此方法
     *
     * @param mouseEvent
     */
    @FXML
    public void cancelUpload(MouseEvent mouseEvent) {
        MouseButton button = mouseEvent.getButton();
        if (MouseButton.PRIMARY.equals(button)) {
            logger.info(button.name() + "....");
            resetValues();
            stage.hide();

        }
    }

    /**
     * 终止导入
     *
     * @param mouseEvent
     */
    @FXML
    public void stopUpload(MouseEvent mouseEvent) {
        MouseButton button = mouseEvent.getButton();
        if (MouseButton.PRIMARY.equals(button)) {
            logger.info("into stop upload....");
            workerTask.getStopUploadFlag().set(true);
            showPanel(panel_choose.getId());
            File temp = new File(dirToUpload, Constants.PATH_TEMP_JPG);
            FileUtils.deleteDir(temp);
        }
    }

    /**
     * 显示导入完毕界面
     *
     * @param mouseEvent
     */
    @FXML
    public void showComplete(MouseEvent mouseEvent) {
        MouseButton button = mouseEvent.getButton();
        if (MouseButton.PRIMARY.equals(button)) {
            logger.info("into showComplete...");
            showPanel(panel_complete.getId());
        }
    }

    /**
     * 跳转标注页面
     *
     * @param mouseEvent
     */
    @FXML
    public void startMark(MouseEvent mouseEvent) {
        MouseButton button = mouseEvent.getButton();
        if (MouseButton.PRIMARY.equals(button)) {
            logger.info("into start mark...");
            landingController.startMark();
            resetValues();
            stage.hide();
        }
    }

    /**
     * 重新进入文件夹选择页面
     *
     * @param mouseEvent
     */
    @FXML
    public void retry(MouseEvent mouseEvent) {
        MouseButton button = mouseEvent.getButton();
        if (MouseButton.PRIMARY.equals(button)) {
            resetValues();
            showPanel(panel_choose.getId());
        }
    }

    @FXML
    public void stage_minimum(MouseEvent mouseEvent) {
        MouseButton button = mouseEvent.getButton();
        if (MouseButton.PRIMARY.equals(button)) {
            stage.setIconified(true);
            ClientApplication.stage.setIconified(true);
        }
    }

    /**
     * 开启导入窗口,初始化页面
     *
     * @param msg 本次导入信息
     */
    @PostMapping("/upload/start")
    public void openUpload(@RequestBody UploadMsg msg) {

        uploadMsg = msg;
        // String batchNumber = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmssSSS"));
        // uploadMsg.setBatchNumber(batchNumber);
        uploadMsg.setToken(Network.TOKEN);
        logger.info("uploadTargetName to upload is: {}", uploadMsg.getUploadTargetName());
        Platform.runLater(() -> {
            if (null == stage) {
                stage = new Stage();
                FXMLUtils.loadWindow(stage, "/static/fxml/upload.fxml", false);
            } else {
                showPanel(panel_choose.getId());
                stage.show();
            }
            // text_success_info.setText("导入批次: " + uploadMsg.getBatchNumber());

        });
    }

    @GetMapping("/originA")
    @ResponseBody
    public Map<String, String> getOriginA() throws IOException {
        String userName = PropertyUtils.getUserName();
        String serverIP = PropertyUtils.getProperty("serverIP");
        logger.info("into request originA... {}", caseJson);
        HashMap<String, String> map = new HashMap<>();
        map.put("userName", userName);
        map.put("serverIP", serverIP);
        map.put("caseJson", caseJson);
        return map;
    }

    @GetMapping(value = "/viewImg")
    public void viewImg(HttpServletRequest req, HttpServletResponse res) {
        try {
            res.reset();
            // PrintWriter out = res.getWriter();
            OutputStream out = res.getOutputStream();
            res.setHeader("Content-Type", "image/jpeg");
            String path = req.getParameter("path");
            //logger.info("img rel path is: " + path);
            path = path.replaceAll("\\\\", "/");
            String appPath = PropertyUtils.getProperty("jpgDir");
            String jpgPath = appPath + "/" + path;
            //logger.info("img abs path is: " + jpgPath);
            try {
                File file = new File(jpgPath);
                if (file != null) {
                    FileInputStream fis = new FileInputStream(file);
                    @SuppressWarnings("resource")
                    BufferedInputStream buff = new BufferedInputStream(fis);
                    byte[] b = new byte[1024];
                    long k = 0;
                    // 开始循环下载
                    while (k < file.length()) {
                        int j = buff.read(b, 0, 1024);
                        k += j;
                        // 将b中的数据写到客户端的内存
                        out.write(b, 0, j);
                    }
                }
                out.flush();
                out.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
        } catch (Exception e) {
            logger.error("加载图片失败！");
            e.printStackTrace();
        }
    }
}
