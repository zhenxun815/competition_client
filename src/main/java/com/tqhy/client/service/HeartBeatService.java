package com.tqhy.client.service;

import com.google.gson.Gson;
import com.tqhy.client.config.Constants;
import com.tqhy.client.models.msg.server.ClientMsg;
import com.tqhy.client.network.Network;
import com.tqhy.client.utils.PropertyUtils;
import io.reactivex.Observable;
import io.reactivex.schedulers.Schedulers;
import javafx.beans.property.BooleanProperty;
import javafx.beans.property.SimpleBooleanProperty;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.concurrent.TimeUnit;

import static com.tqhy.client.config.Constants.CMD_MSG_CONTINUE_BEAT;
import static com.tqhy.client.config.Constants.CMD_MSG_STOP_BEAT;

/**
 * @author Yiheng
 * @create 3/23/2019
 * @since 1.0.0
 */
@Service
public class HeartBeatService {

    Logger logger = LoggerFactory.getLogger(HeartBeatService.class);

    private static String status;
    private String token;
    /**
     * 判断页面是否需要跳转到登录页,与{@link com.tqhy.client.controllers.LandingController LandingController} 中
     * {@code jumpToLandingFlag} 进行双向绑定
     */
    private BooleanProperty jumpToLandingFlag = new SimpleBooleanProperty(false);

    public void stopBeat() {
        status = CMD_MSG_STOP_BEAT;
        Network.TOKEN = null;
    }

    public void startBeat(String t) {
        status = CMD_MSG_CONTINUE_BEAT;
        this.token = t;
        //logger.info("into start beat...{}", token);
        Observable.interval(5, TimeUnit.SECONDS)
                  .takeWhile(beatTimes -> CMD_MSG_CONTINUE_BEAT.equals(status))
                  .observeOn(Schedulers.trampoline())
                  .subscribeOn(Schedulers.io())
                  .subscribe(aLong -> {
                      //logger.info("start token is...{}", token);
                      String serverIP = PropertyUtils.getProperty(Constants.SERVER_IP);
                      if (StringUtils.isEmpty(serverIP)) {
                          stopBeat();
                      } else {
                          Network.getAicApi()
                                 .heartbeat(token)
                                 .observeOn(Schedulers.io())
                                 .subscribeOn(Schedulers.trampoline())
                                 .subscribe(responseBody -> {
                                     String json = responseBody.string();
                                     //logger.info("heart beat response json is: {}", json);
                                     ClientMsg clientMsg = new Gson().fromJson(json, ClientMsg.class);
                                     Integer flag = clientMsg.getFlag();
                                     if (1 == flag) {
                                         logger.info("heart beat continue...{}", token);
                                         status = CMD_MSG_CONTINUE_BEAT;
                                         setJumpToLandingFlag(false);
                                     } else if (Constants.CMD_STATUS_LOGOUT == flag) {
                                         logger.info("heart beat stop...");
                                         stopBeat();
                                         setJumpToLandingFlag(true);
                                     }
                                 });
                      }

                  });
    }

    public boolean isJumpToLandingFlag() {
        return jumpToLandingFlag.get();
    }

    public BooleanProperty jumpToLandingFlagProperty() {
        return jumpToLandingFlag;
    }

    public void setJumpToLandingFlag(boolean jumpToLandingFlag) {
        this.jumpToLandingFlag.set(jumpToLandingFlag);
    }
}
