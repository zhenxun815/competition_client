package com.tqhy.client.models.entity;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.io.Serializable;
import java.util.List;

/**
 * @author Yiheng
 * @create 6/4/2019
 * @since 1.0.0
 */
@Getter
@Setter
@ToString
public class SaveDatas implements Serializable {
    private static final long serialVersionUID = 1L;

    private String fileName;

    private List<SaveDataHead> head;

    private List<SaveDataBody> body;
}
