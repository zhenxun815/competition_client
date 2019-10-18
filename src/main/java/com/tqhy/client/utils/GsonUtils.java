package com.tqhy.client.utils;

import com.google.gson.Gson;
import com.google.gson.stream.JsonReader;
import com.tqhy.client.models.msg.server.ClientMsg;
import okhttp3.ResponseBody;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.io.StringReader;
import java.util.ArrayList;
import java.util.Optional;

/**
 * @author Yiheng
 * @create 4/4/2019
 * @since 1.0.0
 */
public class GsonUtils {

    static Logger logger = LoggerFactory.getLogger(GsonUtils.class);

    public static <T> Optional<T> parseJsonToObj(String json, Class<T> type) {
        JsonReader jsonReader = new JsonReader(new StringReader(json));
        jsonReader.setLenient(true);
        T t = new Gson().fromJson(jsonReader, type);
        return Optional.ofNullable(t);
    }

    public static ClientMsg parseResponseToObj(ResponseBody responseBody) {
        ClientMsg<Object> defaultMsg = new ClientMsg<>();
        defaultMsg.setFlag(0);
        defaultMsg.setMsg(new ArrayList<String>());
        defaultMsg.setDesc("response parse error!");
        try {
            String jsonStr = responseBody.string();
            logger.info("json str is {}", jsonStr);
            return parseJsonToObj(jsonStr, ClientMsg.class).orElse(defaultMsg);
        } catch (IOException e) {
            e.printStackTrace();
        }
        return defaultMsg;
    }
}
