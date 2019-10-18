package com.tqhy.client.task;

import com.tqhy.client.config.Constants;
import com.tqhy.client.models.entity.SaveDataBody;
import com.tqhy.client.models.entity.SaveDataHead;
import com.tqhy.client.models.entity.SaveDatas;
import com.tqhy.client.models.msg.BaseMsg;
import com.tqhy.client.models.msg.local.SaveDataMsg;
import com.tqhy.client.utils.FileUtils;
import io.reactivex.Observable;
import lombok.Getter;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.File;
import java.util.List;
import java.util.concurrent.Callable;

/**
 * @author Yiheng
 * @create 6/4/2019
 * @since 1.0.0
 */
@Getter
@Setter
@RequiredArgsConstructor(staticName = "of")
public class SaveFileTask implements Callable<Observable<SaveDataMsg>> {

    Logger logger = LoggerFactory.getLogger(SaveFileTask.class);


    @NonNull
    private SaveDataMsg saveDataMsg;

    @Override
    public Observable<SaveDataMsg> call() throws Exception {

        File saveDir = saveDataMsg.getSaveDir();
        SaveDatas dataToSave = saveDataMsg.getDataToSave();
        String fileName = dataToSave.getFileName();
        String saveDataStr = getReportsSaveString(dataToSave);

        switch (saveDataMsg.getSaveType()) {
            case SAVE_REPORT_TO_CSV:
                File saveFile = new File(saveDir, fileName + ".csv");
                return Observable.just(saveDataMsg)
                                 .map(msg -> {
                                     FileUtils.writeFile(saveFile, saveDataStr, null, true);
                                     msg.setFlag(BaseMsg.SUCCESS);
                                     return msg;
                                 });
            default:
                return genTaskFailObservable();
        }
    }

    /**
     * 将{@link SaveDatas}对象转换为保存到csv文件字符串
     *
     * @param saveDatas
     * @return
     */
    private String getReportsSaveString(SaveDatas saveDatas) {
        List<SaveDataHead> head = saveDatas.getHead();
        List<SaveDataBody> body = saveDatas.getBody();
        StringBuilder headBuilder = head.stream()
                                        .collect(StringBuilder::new,
                                                 (builder, saveDataHead) -> builder.append(saveDataHead.getTitle())
                                                                                   .append(Constants.VALUE_SPLITTER),
                                                 StringBuilder::append);

        StringBuilder reportsBuilder = body.stream()
                                           .collect(StringBuilder::new,
                                                    (builder, saveDataBody) -> {
                                                        builder.append(saveDataBody.getName())
                                                               .append(Constants.VALUE_SPLITTER)
                                                               .append(saveDataBody.getValue())
                                                               .append(Constants.VALUE_SPLITTER)
                                                               .append(saveDataBody.getPer())
                                                               .append(Constants.NEW_LINE);
                                                    },
                                                    StringBuilder::append);

        return headBuilder.append(Constants.NEW_LINE)
                          .append(reportsBuilder)
                          .toString();
    }

    private Observable<SaveDataMsg> genTaskFailObservable() {
        saveDataMsg.setFlag(BaseMsg.FAIL);
        return Observable.just(saveDataMsg);
    }
}
