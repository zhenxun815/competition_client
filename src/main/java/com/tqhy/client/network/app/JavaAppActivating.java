package com.tqhy.client.network.app;

import lombok.Getter;
import lombok.Setter;

import java.util.Date;

/**
 * @author Yiheng
 * @create 3/19/2019
 * @since 1.0.0
 */
@Setter
@Getter
public class JavaAppActivating extends JavaAppBase {

    String serializableNum;

    /**
     * 测试AIC设备是否联通
     *
     * @param ip
     * @return
     */
    public String testIP(String ip) {
        logger.info("get value: " + ip);
        try {
            Thread.sleep(2000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        return "serializableNum_" + new Date().toString();
    }

    public void nextStep(String serializableNum) {
        setSerializableNum(serializableNum);
        nextPage();
    }

    public int activate(String activatingCode) {
        logger.info("activatingCode is: " + activatingCode);
        try {
            Thread.sleep(2000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        return Integer.parseInt(activatingCode) % 2;
    }

}
