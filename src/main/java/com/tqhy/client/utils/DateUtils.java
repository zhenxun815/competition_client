package com.tqhy.client.utils;

import org.apache.commons.lang3.StringUtils;

import java.util.Calendar;
import java.util.TimeZone;

/**
 * @author Yiheng
 * @create 8/27/2019
 * @since 1.0.0
 */
public class DateUtils {

    public static String getDatetimeFromMills(long millis) {
        Calendar calendar = Calendar.getInstance(TimeZone.getTimeZone("GMT+8"));
        calendar.setTimeInMillis(millis);
        int year = calendar.get(Calendar.YEAR);
        int month = calendar.get(Calendar.MONTH) + 1;
        int day = calendar.get(Calendar.DAY_OF_MONTH);
        int hour = calendar.get(Calendar.HOUR_OF_DAY);
        int minute = calendar.get(Calendar.MINUTE);
        int second = calendar.get(Calendar.SECOND);
        int[] dataArr = {year, month, day};
        int[] timeArr = {hour, minute, second};
        String dateStr = StringUtils.join(dataArr, '-');
        String timeStr = StringUtils.join(timeArr, ':');

        return dateStr.concat(" ").concat(timeStr);
    }
}
