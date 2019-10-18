package com.tqhy.client.utils;

import com.tqhy.client.ClientApplication;
import com.tqhy.client.controllers.PreloaderController;
import javafx.application.Platform;
import javafx.fxml.FXMLLoader;
import javafx.geometry.Rectangle2D;
import javafx.scene.Node;
import javafx.scene.Parent;
import javafx.scene.Scene;
import javafx.scene.image.Image;
import javafx.scene.input.KeyCode;
import javafx.scene.input.KeyCodeCombination;
import javafx.scene.input.KeyCombination;
import javafx.scene.layout.Pane;
import javafx.scene.paint.Color;
import javafx.stage.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.File;
import java.io.IOException;

import static com.tqhy.client.ClientApplication.springContext;

/**
 * @author Yiheng
 * @create 3/22/2019
 * @since 1.0.0
 */
public class FXMLUtils {

    static Logger logger = LoggerFactory.getLogger(FXMLUtils.class);

    public static void loadMenu(String url, double left, double top, double width, double height) {

        if (null == ClientApplication.menuStage) {
            ClientApplication.menuStage = new Stage();
            ClientApplication.menuStage.setWidth(60);
            ClientApplication.menuStage.setHeight(100);
            ClientApplication.menuStage.initStyle(StageStyle.TRANSPARENT);
            ClientApplication.menuStage.setAlwaysOnTop(true);
        }
        Rectangle2D visualBounds = Screen.getPrimary().getVisualBounds();
        double visualWidth = visualBounds.getWidth();
        double visualHeight = visualBounds.getHeight();
        double popX = left > visualWidth / 2 ? left - width : left;
        ClientApplication.menuStage.setX(popX);
        double popY = top > visualHeight / 2 ? top - height : top;
        ClientApplication.menuStage.setY(popY);
        try {
            FXMLLoader loader = new FXMLLoader(FXMLUtils.class.getResource(url));
            Parent parentNode = loader.load();
            loadScene(ClientApplication.menuStage, parentNode, false);
            ClientApplication.menuStage.show();
        } catch (IOException e) {
            logger.error("load menu error", e);
        }
    }

    /**
     * 打开新窗口
     *
     * @param url
     * @return
     */
    public static Stage loadPopWindow(String url) {
        Stage stage = new Stage();
        stage.setResizable(false);
        stage.initStyle(StageStyle.TRANSPARENT);
        return loadWindow(stage, url, true);
    }

    public static Stage loadChooseModel(String url) {
        if (null == ClientApplication.chooseModelStage) {
            ClientApplication.chooseModelStage = new Stage();
            ClientApplication.chooseModelStage.initStyle(StageStyle.DECORATED);
        }
        ClientApplication.chooseModelStage.setHeight(500D);
        ClientApplication.chooseModelStage.setWidth(415D);
        ClientApplication.chooseModelStage.setResizable(false);
        ClientApplication.chooseModelStage.setIconified(false);
        return loadWindow(ClientApplication.chooseModelStage, url, false);
    }

    /**
     * 打开新窗口
     *
     * @param stage
     * @param url
     * @return
     */
    public static Stage loadWindow(Stage stage, String url, boolean fullScreen) {
        try {
            FXMLLoader fxmlLoader = new FXMLLoader(FXMLUtils.class.getResource(url));
            fxmlLoader.setControllerFactory(springContext::getBean);
            Parent parentNode = fxmlLoader.load();
            loadScene(stage, parentNode, fullScreen);
            stage.setAlwaysOnTop(true);
            stage.show();
            return stage;
        } catch (IOException e) {
            e.printStackTrace();
        }
        return null;
    }

    /**
     * 打开新窗口
     *
     * @param stage
     * @param url
     * @return
     */
    public static PreloaderController loadPreloader(Stage stage, String url) {
        try {
            FXMLLoader loader = new FXMLLoader(FXMLUtils.class.getResource(url));
            Parent parentNode = loader.load();
            loadScene(stage, parentNode, false);
            stage.show();
            PreloaderController preloaderController = loader.getController();
            return preloaderController;
        } catch (IOException e) {
            e.printStackTrace();
        }
        return null;
    }

    /**
     * 向{@link Stage Stage}加载{@link Scene Scene}
     *
     * @param stage
     * @param parentNode
     */
    public static void loadScene(Stage stage, Parent parentNode, boolean fullScreen) {
        Scene scene = null;
        if (fullScreen) {
            Rectangle2D visualBounds = Screen.getPrimary().getVisualBounds();
            double visualWidth = visualBounds.getWidth();
            double visualHeight = visualBounds.getHeight();
            scene = new Scene(parentNode, visualWidth, visualHeight, Color.TRANSPARENT);
        } else {
            scene = new Scene(parentNode, Color.TRANSPARENT);
        }
        scene.getStylesheets().add(NetworkUtils.toExternalForm("/static/css/fx_root.css"));
        KeyCombination kc = new KeyCodeCombination(KeyCode.Q, KeyCombination.CONTROL_DOWN);
        scene.getAccelerators().put(kc, () -> {
            Platform.runLater(() -> FXMLUtils.loadChooseModel("/static/fxml/choose_model.fxml"));
        });
        stage.setScene(scene);
        stage.getIcons().add(new Image(NetworkUtils.toExternalForm("/static/img/logo_title_light.png")));
    }

    /**
     * 是否展示子元素节点
     *
     * @param parent
     * @param child
     * @param display 为true则添加,false则移除
     */
    public static void displayChildNode(Pane parent, Node child, boolean display) {
        if (display) {
            if (!parent.getChildren().contains(child)) {
                parent.getChildren().add(child);
            }
        } else {
            if (parent.getChildren().contains(child)) {
                parent.getChildren().remove(child);
            }
        }
    }

    /**
     * 使页面相对屏幕居中
     *
     * @param pane
     */
    public static void center2Display(Pane pane) {
        Rectangle2D visualBounds = Screen.getPrimary().getVisualBounds();
        double visualWidth = visualBounds.getWidth();
        double visualHeight = visualBounds.getHeight();

        pane.setLayoutX((visualWidth - pane.getMinWidth()) / 2);
        pane.setLayoutY((visualHeight - pane.getMinHeight()) / 2);
        //logger.info("pane width {}, pane height {}", pane.getMinWidth(), pane.getMinHeight());
        //logger.info("x {}, y {}", pane.getLayoutX(), pane.getLayoutY());
    }

    /**
     * 弹出选择文件夹窗口并返回选择路径
     *
     * @param window 若为null则使用主窗口{@link ClientApplication#stage}对象
     * @return
     */
    public static File chooseDir(Window window) {
        DirectoryChooser downloadDirChooser = new DirectoryChooser();
        return downloadDirChooser.showDialog(null == window ? ClientApplication.stage : window);
    }
}
