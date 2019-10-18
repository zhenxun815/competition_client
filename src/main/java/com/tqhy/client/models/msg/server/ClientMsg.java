package com.tqhy.client.models.msg.server;

import com.tqhy.client.models.msg.BaseMsg;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

/**
 * @author Yiheng
 * @create 3/18/2019
 * @since 1.0.0
 */
@Getter
@Setter
public class ClientMsg<T> extends BaseMsg {

    public T data;

    public List<String> msg;
}
