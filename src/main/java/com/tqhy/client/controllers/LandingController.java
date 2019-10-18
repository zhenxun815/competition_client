package com.tqhy.client.controllers;

import com.tqhy.client.config.Constants;
import com.tqhy.client.models.msg.BaseMsg;
import com.tqhy.client.models.msg.local.LandingMsg;
import com.tqhy.client.models.msg.local.VerifyMsg;
import com.tqhy.client.models.msg.server.ClientMsg;
import com.tqhy.client.network.Network;
import com.tqhy.client.utils.GsonUtils;
import com.tqhy.client.utils.NetworkUtils;
import com.tqhy.client.utils.PropertyUtils;
import io.reactivex.schedulers.Schedulers;
import javafx.fxml.FXML;
import javafx.scene.web.WebEngine;
import javafx.scene.web.WebView;
import lombok.Getter;
import lombok.Setter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

/**
 * @author Yiheng
 * @create 3/18/2019
 * @since 1.0.0
 */
@RestController
@Getter
@Setter
public class LandingController extends BaseWebviewController {

    static Logger logger = LoggerFactory.getLogger(LandingController.class);

    @FXML
    private WebView webView;

    @Value("${network.url.connection:''}")
    private String connectionUrl;

    @Value("${network.url.mark:''}")
    private String markUrl;

    @Value("${network.url.landing:''}")
    private String landingUrl;

    @Value("${network.url.test:''}")
    private String testUrl;

    @Value("${path.data:'/data/'}")
    private String localDataPath;

    private WebEngine webEngine;

    private boolean landingIgnore;


    public void showPage(String url2show) {
        logger.info("load ai case ing index page..., {}", url2show);
        loadPage(webView, url2show);
    }

    @FXML
    void initialize() {
        super.initialize(webView);
        String landingIgnoreConfig = PropertyUtils.getProperty(Constants.LANDING_IGNORE);
        landingIgnore = !StringUtils.isEmpty(landingIgnoreConfig) && Boolean.parseBoolean(landingIgnoreConfig);
        if (StringUtils.isEmpty(Network.SERVER_IP)) {
            logger.info("init load url is connection");
            loadConnectionPage();
        } else if (landingIgnore) {
            loadPage(webView, Network.SERVER_BASE_URL + "/case/release");
        } else {
            loadPage(webView, Network.LOCAL_BASE_URL + landingUrl);
        }

    }

    public void loadConnectionPage() {
        loadPage(webView, Network.LOCAL_BASE_URL + connectionUrl);
    }

    @PostMapping("/landing")
    @ResponseBody
    public VerifyMsg landing(@RequestBody LandingMsg landingMsg) {
        logger.info("get LandingMsg.." + landingMsg);
        VerifyMsg response = new VerifyMsg();

        String localIp = NetworkUtils.getLocalIp();
        if (!NetworkUtils.isIP(localIp)) {
            response.setFlag(BaseMsg.FAIL);
            response.setDesc("IP地址获取失败!");
            return response;
        }

        String userName = landingMsg.getUserName().trim();
        String userPwd = landingMsg.getUserPwd().trim();
        PropertyUtils.setUserName(userName);

        Network.getAicApi()
               .landing(userName, userPwd)
               .observeOn(Schedulers.io())
               .subscribeOn(Schedulers.trampoline())
               .map(body -> {
                   ClientMsg clientMsg = GsonUtils.parseResponseToObj(body);
                   logger.info("land response msg is {}", clientMsg);
                   logger.info("flag is: " + clientMsg.getFlag());
                   response.setFlag(clientMsg.getFlag());
                   response.setDesc(clientMsg.getDesc());
                   List<String> msg = clientMsg.getMsg();
                   String token = msg.get(0);
                   logger.info("map token is: " + token);
                   response.setToken(token);
                   response.setLocalIP(localIp);
                   response.setServerIP(Network.SERVER_IP);
                   logger.info("response server ip is: {}", Network.SERVER_IP);
                   return response;
               })
               .blockingSubscribe(res -> {
                   if (BaseMsg.SUCCESS == res.getFlag()) {
                       logger.info("subscribe token is {}", response.getToken());
                       heartBeatService.startBeat(response.getToken());
                       Network.TOKEN = response.getToken();
                   }
               });
        logger.info("response is {}", response);
        return response;
    }

    @GetMapping("/logout")
    public void logout() {
        super.logout();
    }

    @GetMapping("/user/name")
    @ResponseBody
    public String getUserName() throws IOException {
        return PropertyUtils.getUserName();
    }


    @PostMapping("/verify/connection")
    public VerifyMsg activateClient(@RequestBody VerifyMsg msg) {
        heartBeatService.stopBeat();
        logger.info("get request.." + msg);
        String serverIP = msg.getServerIP();
        VerifyMsg response = new VerifyMsg();
        Network.SERVER_IP = serverIP;
        Network.setServerBaseUrl(serverIP);
        logger.info("base url is: " + Network.SERVER_BASE_URL);
        try {
            okhttp3.ResponseBody responseBody = Network.getAicApi()
                                                       .pingServer()
                                                       .execute()
                                                       .body();
            ClientMsg clientMsg = GsonUtils.parseResponseToObj(responseBody);

            if (BaseMsg.SUCCESS == clientMsg.getFlag()) {
                logger.info("ping server: " + serverIP + " successCount");
                PropertyUtils.setProperty(Constants.SERVER_IP, serverIP);
                response.setLandingIgnore(landingIgnore);
                response.setFlag(1);
                response.setServerIP(Network.SERVER_IP);
                return response;
            }

        } catch (IOException e) {
            e.printStackTrace();
        }

        return response;
    }

    void sendMsgToJs(String funcName, String... msgs) {
        super.sendMsgToJs(webView, funcName, msgs);
    }
}
