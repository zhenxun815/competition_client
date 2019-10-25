package com.tqhy.client.models.entity;

import lombok.*;

import java.io.Serializable;
import java.util.List;

/**
 * @author Yiheng
 * @create 8/27/2019
 * @since 1.0.0
 */
@Getter
@Setter
@ToString
@RequiredArgsConstructor(staticName = "of")
public class Case implements Serializable {
    private static final long serialVersionUID = 1L;

    @NonNull
    private String id;

    @NonNull
    private String caseName;

    @NonNull
    private List<OriginData> originDatas;

}
