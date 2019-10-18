package com.tqhy.client.utils;


import com.tqhy.client.config.Constants;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.util.StringUtils;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.Properties;

/**
 * @author poorguy
 * @version 0.0.1
 * @E-mail 494939649@qq.com
 * @created 2019/5/8 11:33
 * @description 需要获取配置文件的绝对路径，对配置文件的修改才会持久化
 */
public class PropertyUtils {

    static Logger logger = LoggerFactory.getLogger(PropertyUtils.class);

    public static String getProperty(String key) {
        File configFile = FileUtils.getLocalFile("/data/", "config.properties");
        if (!configFile.exists()) {
            logger.info("config file not exist...");
            FileUtils.createNewFile(configFile);
            return "";
        }
        Properties properties = new Properties();
        try {
            properties.load(new FileInputStream(configFile));
        } catch (IOException e) {
            logger.error("can't load config file", e);
        }
        String value = properties.getProperty(key);
        return StringUtils.isEmpty(value) ? "" : value;
    }

    public static void setProperty(String key, String value) {
        File configFile = FileUtils.getLocalFile("/data/", "config.properties");
        Properties properties = new Properties();

        try {
            if (!configFile.exists()) {
                FileUtils.createNewFile(configFile);
            }
            properties.load(new FileInputStream(configFile));
            FileOutputStream fos = new FileOutputStream(configFile);
            properties.setProperty(key, value);
            properties.store(fos, "update");
            fos.close();
        } catch (IOException e) {
            logger.error("can't load config file", e);
        }
    }

    public static void setUserName(String name) {
        setProperty(Constants.USERNAME, name);
    }

    public static String getUserName() {
        return getProperty(Constants.USERNAME);
    }
}
