package com.tqhy.client.utils;

import com.tqhy.client.config.Constants;
import com.tqhy.client.models.msg.BaseMsg;
import com.tqhy.client.models.msg.server.ClientMsg;
import com.tqhy.client.network.Network;
import okhttp3.MediaType;
import okhttp3.MultipartBody;
import okhttp3.RequestBody;
import okhttp3.ResponseBody;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.util.StringUtils;

import java.io.File;
import java.io.IOException;
import java.net.*;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Pattern;

/**
 * @author Yiheng
 * @create 3/19/2019
 * @since 1.0.0
 */
public class NetworkUtils {

    static Logger logger = LoggerFactory.getLogger(NetworkUtils.class);

    /**
     * 将本地路径转为URL对象
     *
     * @param url
     * @return
     */
    public static String toExternalForm(String url) {
        logger.info("url is: " + url);
        URL resource = NetworkUtils.class.getResource(url);

        return null == resource ? null : resource.toExternalForm();
    }

    /**
     * 获取本地mac地址
     *
     * @return
     */
    public static String getPhysicalAddress() {
        try {
            InetAddress ia = InetAddress.getLocalHost();
            byte[] mac = NetworkInterface.getByInetAddress(ia).getHardwareAddress();
            //System.out.println("mac数组长度：" + mac.length);
            StringBuffer sb = new StringBuffer();
            for (int i = 0; i < mac.length; i++) {
                if (i != 0) {
                    sb.append("-");
                }
                //字节转换为整数
                int temp = mac[i] & 0xff;
                String str = Integer.toHexString(temp);
                // logger.info("每8位:" + str);
                if (str.length() == 1) {
                    sb.append("0" + str);
                } else {
                    sb.append(str);
                }
            }
            logger.info("本机MAC地址:" + sb.toString().toUpperCase());
            return sb.toString();
        } catch (UnknownHostException e) {
            e.printStackTrace();
        } catch (SocketException e) {
            e.printStackTrace();
        }
        return null;
    }


    /**
     * 获取本地ip
     *
     * @return 本地ip字符串
     */
    public static String getLocalIp() {
        String ip = "";
        String hostAddress = "";
        try {
            byte[] addr = InetAddress.getLocalHost().getAddress();
            hostAddress = InetAddress.getLocalHost().getHostAddress();
            ip = (addr[0] & 0xff) + "." + (addr[1] & 0xff) + "." + (addr[2] & 0xff) + "." + (addr[3] & 0xff);
        } catch (UnknownHostException e) {
            e.printStackTrace();
        }
        logger.info("local ip is: " + ip + ", hostAddress is: " + hostAddress);
        return ip;
    }

    /**
     * 初始化获取后台IP地址
     *
     * @return
     */
    public static String initServerIP() {
        logger.info("into init webEngine..");

        String serverIP = PropertyUtils.getProperty(Constants.SERVER_IP);
        if (StringUtils.isEmpty(serverIP)) {
            return "";
        }

        Network.setServerBaseUrl(serverIP);
        try {
            ResponseBody body = Network.getAicApi()
                                       .pingServer()
                                       .execute()
                                       .body();

            ClientMsg clientMsg = GsonUtils.parseResponseToObj(body);
            Integer flag = clientMsg.getFlag();
            logger.info("ping server ip: " + serverIP + ", get flag: " + flag);
            if (BaseMsg.SUCCESS == flag) {
                return serverIP;
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
        return "";
    }


    /**
     * Ip地址判断<br>
     *
     * @param str
     * @return
     */
    public static boolean isIP(String str) {

        if (StringUtils.isEmpty(str)) {
            return false;
        }
        String regex = "[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}(\\:[0-9]+)?";
        Pattern pattern = Pattern.compile(regex);

        return pattern.matcher(str).matches();

    }

    /**
     * Ip地址判断<br>
     *
     * @param str
     * @return
     */
    public static boolean isNotIP(String str) {
        return !isIP(str);
    }

    /**
     * 创建单参数请求,将字符串转换为{@link RequestBody}对象
     *
     * @param content
     * @return
     */
    public static RequestBody createRequestParam(String content) {
        if (content == null) {
            content = "";
        }
        RequestBody body = RequestBody.create(MediaType.parse("multipart/form-data"), content);
        return body;
    }

    /**
     * 拼接url请求
     *
     * @param host
     * @param port
     * @param path
     * @param params
     * @return
     */
    public static String createUrl(String host, int port, String path, Map<String, String> params) {
        String basePath = host.concat(":").concat(Integer.toString(port));
        return createUrl(basePath, path, params);
    }

    public static String createUrl(String basePath, String path, Map<String, String> params) {
        StringBuilder builder = new StringBuilder(basePath).append(path).append("?");
        params.forEach((k, v) -> builder.append(k).append("=").append(v).append("&"));
        return builder.deleteCharAt(builder.lastIndexOf("&")).toString();
    }

    /**
     * 创建多参数请求
     *
     * @param params
     * @return
     */
    public static Map<String, RequestBody> createRequestParamMap(Map<String, String> params) {
        HashMap<String, RequestBody> paramMap = new HashMap<>();
        params.forEach((k, v) -> {
            RequestBody requestParam = createRequestParam(v);
            paramMap.put(k, requestParam);
        });
        return paramMap;
    }


    /**
     * 根据待上传文件路径生成上传文件{@link MultipartBody.Part}对象
     *
     * @param filePath
     * @return
     */
    public static MultipartBody.Part createFilePart(String partName, String filePath) {
        File file = new File(filePath);
        RequestBody requestFile = RequestBody.create(MediaType.parse("multipart/form-data"), file);
        MultipartBody.Part part = MultipartBody.Part.createFormData(partName, file.getName(), requestFile);
        return part;
    }

    /**
     * 根据待上传文件路径生成上传文件{@link MultipartBody.Part}对象
     *
     * @param uploadFileMap
     * @return
     */
    public static List<MultipartBody.Part> createMultiFilePart(Map<String, String> uploadFileMap) {
        List<MultipartBody.Part> multiParts = new ArrayList<>();
        uploadFileMap.forEach((partName, filePath) -> {
            MultipartBody.Part filePart = createFilePart(partName, filePath);
            multiParts.add(filePart);
        });

        return multiParts;
    }
}
