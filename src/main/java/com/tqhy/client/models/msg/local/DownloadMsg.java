package com.tqhy.client.models.msg.local;

import com.tqhy.client.models.entity.DownloadInfo;
import com.tqhy.client.models.enums.DownloadTaskApi;
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
public class DownloadMsg extends BaseMsg {
    /**
     * 下载请求的接口名
     */
    @NonNull
    private DownloadTaskApi downloadTaskApi;

    /**
     * 下载保存文件夹
     */
    @NonNull
    private File downloadDir;

    /**
     * 下载请求参数
     */
    @NonNull
    private DownloadInfo downloadInfo;
}
