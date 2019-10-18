package com.tqhy.client.network.app;

import com.tqhy.client.utils.NetworkUtils;
import javafx.application.Platform;
import javafx.scene.web.WebEngine;
import javafx.stage.Stage;
import lombok.Getter;
import lombok.NonNull;
import lombok.Setter;
import lombok.experimental.FieldNameConstants;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * @author Yiheng
 * @create 2018/8/10
 * @since 1.0.0
 */
@Getter
@Setter
public class JavaAppBase {
    Stage stage;
    @NonNull
    WebEngine webEngine;
    String nextPageUrl;
    String lastPageUrl;
    @FieldNameConstants.Exclude
    Logger logger = LoggerFactory.getLogger(JavaAppBase.class);

    /**
     * 在java控制台输出js内容
     *
     * @param log
     */
    public void showLog(String log) {
        logger.info("http log: " + log);
    }


    /**
     * 关闭当前web页面窗口
     */
    public void closeWindow() {
        logger.info("close window...");
        Platform.runLater(() -> {
            stage.close();
        });
    }

    public void toPage(String url, boolean isLocalPage) {
        webEngine.load(isLocalPage ? NetworkUtils.toExternalForm(url) : url);
    }

    /**
     * 跳转到下一个web页
     */
    public void nextPage() {
        String localUrl = NetworkUtils.toExternalForm(nextPageUrl);
        webEngine.load(localUrl);
    }

    /**
     * 跳转到上一个web页
     */
    public void lastPage() {
        String localUrl = NetworkUtils.toExternalForm(lastPageUrl);
        webEngine.load(localUrl);
    }

    public Stage getStage() {
        return stage;
    }

    public void setStage(Stage stage) {
        this.stage = stage;
    }
}
