package com.tqhy.client.utils;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * @author Yiheng
 * @create 4/11/2019
 * @since 1.0.0
 */
public class SystemUtils {

    static Logger logger = LoggerFactory.getLogger(SystemUtils.class);

    public static final String SYS_ARC_64 = "amd64";

    public static final String SYS_ARC_32 = "X86";

    public static String getArc() {
        //String arch = System.getProperty("sun.arch.data.model");
        String arch = System.getProperty("os.arch");
        logger.info("arch:" + arch);
        return arch;
    }

    public static String getLibPath() {
        String libPath = System.getProperty("java.library.path");
        logger.info("lib path: is: " + libPath);
        return libPath;
    }

    public static void setLibPath(String path) {
        String libPath = getLibPath();
        libPath = libPath + ";" + path;
        System.setProperty("java.library.path", libPath);
        logger.info("set lib path: " + getLibPath());
    }
}
