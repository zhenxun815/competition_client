package com.tqhy.client.config;

/**
 * @author Yiheng
 * @create 4/8/2019
 * @since 1.0.0
 */
public class Constants {

    public static final String NEW_LINE = System.getProperty("line.separator");


    /************************ CMD *************************/
    public static final String CMD_MSG_LOGOUT = "203";


    //alert('upload_case;' + uploadId + ';' + uploadTargetName)
    public static final String CMD_MSG_UPLOAD = "upload";

    public static final String CMD_MSG_DOWNLOAD = "download";

    public static final String CMD_MSG_SAVE = "save";

    public static final String CMD_MSG_STOP_BEAT = "stop";

    public static final String CMD_MSG_CONTINUE_BEAT = "continue";

    public static final int CMD_STATUS_LOGOUT = 203;

    /************************ PATH *************************/


    public static final String PATH_TEMP_JPG = "TQHY_TEMP";


    public static final String CMD_NOT_UPLOAD = "NOT_UPLOAD";

    public static final String MSG_SPLITTER = ";";

    public static final String VALUE_SPLITTER = ",";

    public static final String CASE_NAME_INVALID = "TQHY_INVALID";

    /************************ CONFIG *************************/

    public static final String SERVER_IP = "serverIP";

    public static final String USERNAME = "username";

    public static final String LANDING_IGNORE = "landingIgnore";
}
