package com.tqhy.client.models.msg;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.io.Serializable;

/**
 * @author Yiheng
 * @create 3/21/2019
 * @since 1.0.0
 */
@Getter
@Setter
@ToString
public class BaseMsg implements Serializable {

    static final long serialVersionUID = 1L;

    /**
     * 请求成功,返回正确结果
     */
    public static final Integer SUCCESS = 1;

    /**
     * 请求成功,未获取正确结果
     */
    public static final Integer FAIL = 0;

    /**
     * flag=={@link #SUCCESS SUCCESS},请求成功,返回正确结果
     * flag=={@link #FAIL FAIL},请求成功,未获取正确结果
     */
    Integer flag;

    /**
     * 响应描述信息
     */
    String desc;

}
