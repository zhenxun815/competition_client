package com.tqhy.client.models.msg.local;

import com.tqhy.client.models.msg.BaseMsg;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * @author Yiheng
 * @create 3/22/2019
 * @since 1.0.0
 */
@Getter
@Setter
@ToString
public class LandingMsg extends BaseMsg {

    private String userName;

    private String userPwd;
}
