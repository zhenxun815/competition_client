package com.tqhy.client.utils;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.UUID;
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;


public class PrimaryKeyUtil {
    private static Lock lock = new ReentrantLock();

    public static String getUuid() {
        return UUID.randomUUID().toString().replaceAll("-", "");
    }

    public static synchronized String getDateCode() {
        StringBuffer strdate = new StringBuffer();
        lock.lock();
        try {
            strdate.append(new SimpleDateFormat("yyyyMMddHHmmssSSS").format(new Date()));
        } finally {
            lock.unlock();
        }
        return strdate.toString();
    }

    public static String getMd5(String password) {

        try {
            // 得到一个信息摘要器
            MessageDigest digest = MessageDigest.getInstance("md5");
            byte[] result = digest.digest(password.getBytes());
            StringBuffer buffer = new StringBuffer();
            // 把没一个byte 做一个与运算 0xff;
            for (byte b : result) {
                // 与运算
                int number = b & 0xff;// 加盐
                String str = Integer.toHexString(number);
                if (str.length() == 1) {
                    buffer.append("0");
                }
                buffer.append(str);
            }

            // 标准的md5加密后的结果
            return buffer.toString();
        } catch (NoSuchAlgorithmException e) {
            e.printStackTrace();
            return "";
        }

    }

    public static void main(String args[]) {
        System.out.println(PrimaryKeyUtil.getMd5("admin"));
    }
}
