package com.tqhy.client;

import com.tqhy.client.utils.FXMLUtils;
import javafx.application.Application;
import javafx.application.Platform;
import javafx.geometry.Rectangle2D;
import javafx.stage.Screen;
import javafx.stage.Stage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ConfigurableApplicationContext;

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.event.MouseEvent;
import java.awt.event.MouseListener;
import java.io.IOException;
import java.net.URL;

/**
 * @author Yiheng
 * @create 1/29/2019
 * @since 1.0.0
 */
@SpringBootApplication
public class ClientApplication extends Application {

    static Logger logger = LoggerFactory.getLogger(ClientApplication.class);
    public static ConfigurableApplicationContext springContext;
    public static Stage stage;
    public static Stage menuStage;
    public static Stage chooseModelStage;

    @Override
    public void start(Stage primaryStage) throws Exception {

        stage = primaryStage;
        stage.setOnCloseRequest(event -> {
            event.consume();
            FXMLUtils.loadPopWindow("/static/fxml/warning_onclose.fxml");
        });

        initPrimaryStageSize();

    }


    /**
     * 初始最大化窗口,固定窗体大小
     */
    private void initPrimaryStageSize() {

        Rectangle2D visualBounds = Screen.getPrimary().getVisualBounds();
        stage.setX(visualBounds.getMinX());
        stage.setY(visualBounds.getMinY());
        logger.info("stage: x {}, y {}", stage.getX(), stage.getY());
        stage.setMaximized(true);
        FXMLUtils.loadWindow(stage, "/static/fxml/main.fxml", true);
        double st_width = stage.getWidth();
        double st_height = stage.getHeight();
        logger.info("st width {}, height {}", st_width, st_height);
        stage.setMinWidth(st_width);
        stage.setMinHeight(st_height);
        stage.setMaxWidth(st_width);
        stage.setMaxHeight(st_height);

    }

    /**
     * 创建系统托盘图标
     */
    private void initSystemTray() {
        try {
            System.setProperty("java.awt.headless", "false");
            Toolkit.getDefaultToolkit();
            if (!java.awt.SystemTray.isSupported()) {
                logger.info("系统不支持托盘图标,程序退出..");
                Platform.exit();
            }
            //PopupMenu popupMenu = createPopMenu(stage);

            SystemTray systemTray = SystemTray.getSystemTray();
            String iconPath = ClientApplication.class.getResource("/static/img/logo_systray.png").toExternalForm();
            URL imageLoc = new URL(iconPath);
            java.awt.Image image = ImageIO.read(imageLoc);
            //final TrayIcon trayIcon = new TrayIcon(image, "打开悬浮窗",popupMenu);
            final TrayIcon trayIcon = new TrayIcon(image);

            trayIcon.addMouseListener(new MouseListener() {
                @Override
                public void mouseClicked(MouseEvent e) {
                    if (e.getButton() > 1) {
                        logger.info("button 2 clicked...");
                        Platform.runLater(
                                () -> FXMLUtils.loadMenu("/static/fxml/menu.fxml",
                                                         e.getX() + 0D,
                                                         e.getY() + 0D,
                                                         60,
                                                         100));
                    }
                }

                @Override
                public void mousePressed(MouseEvent e) {

                }

                @Override
                public void mouseReleased(MouseEvent e) {

                }

                @Override
                public void mouseEntered(MouseEvent e) {

                }

                @Override
                public void mouseExited(MouseEvent e) {
                    Platform.runLater(() -> menuStage.hide());
                }
            });
            systemTray.add(trayIcon);


        } catch (IOException e) {
            e.printStackTrace();
        } catch (AWTException e) {
            e.printStackTrace();
        }
    }

    @Override
    public void init() throws Exception {
        super.init();
        springContext = SpringApplication.run(ClientApplication.class);
        /*java.util.logging.Logger globalScreenLogger = java.util.logging.Logger.getLogger(
                GlobalScreen.class.getPackage().getName());
        globalScreenLogger.setLevel(Level.OFF);*/
        Platform.setImplicitExit(false);
       /* try {
            GlobalScreen.registerNativeHook();
        } catch (NativeHookException ex) {
            logger.error("There was a problem registering the native hook.", ex);
            System.exit(1);
        }

        GlobalScreen.addNativeKeyListener(new GlobalKeyListener());*/
        initSystemTray();
    }


    @Override
    public void stop() {
        springContext.stop();
        try {
            super.stop();
            System.exit(0);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public static void main(String[] args) {
        launch(args);
        logger.info("init hot key...");

    }


}
