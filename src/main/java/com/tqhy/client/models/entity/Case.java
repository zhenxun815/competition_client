package com.tqhy.client.models.entity;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.io.Serializable;

/**
 * @author Yiheng
 * @create 8/27/2019
 * @since 1.0.0
 */
@Getter
@Setter
@ToString
public class Case implements Serializable {
    private static final long serialVersionUID = 1L;

    private String id;

    private Long seriesDate;

    private Long seriesTime;

    private String part;

}
