package com.tqhy.client.jna;

import com.sun.jna.Native;
import com.sun.jna.NativeLibrary;
import com.sun.jna.Pointer;
import com.sun.jna.win32.StdCallLibrary;
import com.tqhy.client.utils.FileUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * @author Yiheng
 * @create 2018/6/28
 * @since 1.0.0
 */
public class JnaCaller {

    private static Logger logger = LoggerFactory.getLogger(JnaCaller.class);
    private static String NATIVE_LIB_NAME = "jyTQAITools";

    /**
     * 系统尚未授权
     */
    public static final String FETCH_DATA_LICENSE = "JYLICENSE";
    /**
     * 非RIS窗口,未获取数据
     */
    public static final String FETCH_DATA_NODATA = "JYNODATA";
    /**
     * 连接动态库失败
     */
    public static final String FETCH_DATA_FAILED = "FAILED";

    public static String jniRootPath;

    public static int idX;
    public static int idY;
    public static int idWidth;
    public static int idHeight;

    /*static {
        idX = Integer.parseInt(PropertyUtils.getProperty("idX"));
        idY = Integer.parseInt(PropertyUtils.getProperty("idY"));
        idWidth = Integer.parseInt(PropertyUtils.getProperty("idWidth"));
        idHeight = Integer.parseInt(PropertyUtils.getProperty("idHeight"));

    }*/

    /**
     * 调用dll中jyFetchData方法
     *
     * @return "JYLICENSE":表示系统尚未被授权;"JYNODATA":表示未获得有效数据;其它:获得的有效 HIS 数据
     */
    public static String fetchData(String imgPath, int left, int top, int width, int height) {
        String result1 = "";
        String result2 = "";
        try {
            logger.info("into fetchData....");
            logger.info("left: " + left + " top: " + top + " width: " + width + " height: " + height);
            NativeLibrary.addSearchPath(NATIVE_LIB_NAME, FileUtils.getAppPath());
            Native.register(TqaiDll.class, NATIVE_LIB_NAME);
            TqaiDll caller = Native.loadLibrary(NATIVE_LIB_NAME, TqaiDll.class);
            Pointer p1 = caller.jyFetchDataEx(imgPath, left, top, width, height);
            System.out.println("ps is: " + p1);
            result1 = p1.getString(0L);
            System.out.println("result1 is " + result1);
            logger.info("fetch data success: " + result1);

            return result1 + "$tqhy$" + result2;
        } catch (Throwable e) {
            logger.error("load dll fail..", e);
        }
        return FETCH_DATA_FAILED;
    }

    /**
     * 调用动态库接口类
     */
    interface TqaiDll extends StdCallLibrary {

        //TqaiDll caller = Native.loadLibrary(NATIVE_LIB_NAME, TqaiDll.class);

        Pointer jyFetchDataEx(String imgPath, int x, int y, int width, int height);

        void jyGetUserInfo();
    }
}
