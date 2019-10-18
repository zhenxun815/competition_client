package com.tqhy.client.controllers;

import javafx.beans.property.SimpleDoubleProperty;
import javafx.beans.property.SimpleStringProperty;
import javafx.fxml.FXML;
import javafx.scene.control.ProgressBar;
import javafx.scene.text.Text;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * @author Yiheng
 * @create 4/15/2019
 * @since 1.0.0
 */

public class PreloaderController {

    Logger logger = LoggerFactory.getLogger(PreloaderController.class);

    private SimpleDoubleProperty preloadProgress = new SimpleDoubleProperty(0.0D);

    private SimpleStringProperty preloadMessage = new SimpleStringProperty();

    /**
     * 初始化进度
     */
    @FXML
    ProgressBar progress_bar_preloader;


    @FXML
    Text text_preloader_desc;

    @FXML
    public void initialize() {
        progress_bar_preloader.progressProperty()
                              .bind(this.preloadProgress);

        text_preloader_desc.textProperty()
                           .bind(this.preloadMessage);
    }

    public double getPreloadProgress() {
        return preloadProgress.get();
    }

    public SimpleDoubleProperty preloadProgressProperty() {
        return preloadProgress;
    }

    public void setPreloadProgress(double preloadProgress) {
        this.preloadProgress.set(preloadProgress);
    }

    public String getPreloadMessage() {
        return preloadMessage.get();
    }

    public SimpleStringProperty preloadMessageProperty() {
        return preloadMessage;
    }

    public void setPreloadMessage(String preloadMessage) {
        this.preloadMessage.set(preloadMessage);
    }
}
