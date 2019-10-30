package com.tqhy.client.models.entity;

import com.google.gson.annotations.SerializedName;
import lombok.Getter;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

/**
 * @author Yiheng
 * @create 10/21/2019
 * @since 1.0.0
 */
@Getter
@Setter
@RequiredArgsConstructor(staticName = "of")
public class OriginData {

    @NonNull
    @SerializedName("imgID")
    private String imgId;

    @NonNull
    private Integer imgWidth;

    @NonNull
    private Integer imgHeight;

    @NonNull
    private String imagePath;

    @SerializedName("circle_datas")
    private List circleDatas = new ArrayList();
}
