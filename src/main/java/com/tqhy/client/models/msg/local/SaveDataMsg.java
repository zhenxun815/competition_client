package com.tqhy.client.models.msg.local;

import com.tqhy.client.models.entity.SaveDatas;
import com.tqhy.client.models.enums.SaveTaskType;
import com.tqhy.client.models.msg.BaseMsg;
import lombok.*;

import java.io.File;

/**
 * @author Yiheng
 * @create 6/4/2019
 * @since 1.0.0
 */
@Getter
@Setter
@ToString
@RequiredArgsConstructor(staticName = "of")
public class SaveDataMsg extends BaseMsg {

    @NonNull
    private SaveTaskType saveType;

    @NonNull
    private File saveDir;

    @NonNull
    private SaveDatas dataToSave;
}
