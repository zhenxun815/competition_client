package com.tqhy.client.models.entity;

import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;

/**
 * @author Yiheng
 * @create 8/27/2019
 * @since 1.0.0
 */
@Getter
@Setter
public class Model implements Serializable {
    private static final long serialVersionUID = 1L;

    private String id;

    private String name;
}
