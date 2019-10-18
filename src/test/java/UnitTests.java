import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import com.google.gson.stream.JsonReader;
import com.tqhy.client.jna.JnaCaller;
import com.tqhy.client.models.entity.DownloadInfo;
import com.tqhy.client.models.entity.Model;
import com.tqhy.client.models.msg.server.ClientMsg;
import com.tqhy.client.models.msg.server.ModelMsg;
import com.tqhy.client.network.Network;
import com.tqhy.client.utils.DateUtils;
import com.tqhy.client.utils.FileUtils;
import com.tqhy.client.utils.GsonUtils;
import okhttp3.ResponseBody;
import okio.BufferedSink;
import okio.Okio;
import org.junit.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.StringReader;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;

/**
 * @author Yiheng
 * @create 1/29/2019
 * @since 1.0.0
 */

public class UnitTests {

    Logger logger = LoggerFactory.getLogger(UnitTests.class);

    @Test
    public void testOther() {
        String str = "中文";
        byte[] bytes = str.getBytes();
        logger.info("length is {}", bytes.length);
    }

    @Test
    public void testJudgeDcm() {
        String dirPath = "H:\\肺结节整理\\35";
        String dcmName = "1.3.6.1.4.1.25403.127846690305080.3884.20190725093946.3.dcm";
        boolean isDcm = FileUtils.isDcmFile(new File(dirPath, dcmName));
        logger.info("is dcm {}", isDcm);

        Optional<File> jpgFileOpt = FileUtils.transToJpg(new File(dirPath, dcmName), new File(dirPath));
        logger.info(jpgFileOpt.isPresent() ? jpgFileOpt.get().getAbsolutePath() : "fail");
    }

    @Test
    public void testParseDcm() {

        String libPath = System.getProperty("java.library.path");
        logger.info("lib path: is: " + libPath);

        File dcmDir = new File("C:\\Users\\qing\\Desktop\\CT异常检测泛测数据\\正常");
        File[] dcmFiles = dcmDir.listFiles(FileUtils::isDcmFile);
        logger.info("dcm count is: " + dcmFiles.length);
        Arrays.stream(dcmFiles)
              .forEach(dcmFile -> {
                  Optional<File> jpgOpt = FileUtils.transToJpg(dcmFile, dcmDir);
                  if (jpgOpt.isPresent()) {
                      File jpgFile = jpgOpt.get();
                      System.out.println("trans jpg file finish..." + jpgFile.getAbsolutePath());
                  }
              });
    }

    @Test
    public void testFileUtils() {
       /* String imgPath = "C:\\Users\\qing\\Pictures\\shadow\\error\\test2\\13.jpeg";
        File imgFile = new File(imgPath);
        boolean isJpgFile = FileUtils.isJpgFile(imgFile);
        logger.info("is jpg file {}", isJpgFile);*/

        String dirPath = "C:\\Users\\qing\\Desktop\\追加数据";
        File dir = new File(dirPath);
        HashMap<File, String> filesMapInRootDir = FileUtils.getFilesMapInRootDir(dir, file -> FileUtils.isDcmFile(
                file) || FileUtils.isJpgFile(file));
        HashMap<File, String> tempTotalFile = new HashMap<>();
        tempTotalFile.putAll(filesMapInRootDir);
        logger.info("files {}", tempTotalFile.size());
    }

    @Test
    public void testGetFileMap() {
        File dir = new File("F:\\dicom\\1234");
        HashMap<File, String> filesMapInRootDir =
                FileUtils.getFilesMapInRootDir(dir,
                                               file -> FileUtils.isDcmFile(file) || FileUtils.isJpgFile(file));
        HashMap<File, String> filesMapInSubDir =
                FileUtils.getFilesMapInSubDir(dir,
                                              file -> FileUtils.isDcmFile(file) || FileUtils.isJpgFile(file),
                                              dir);
        logger.info("root dir file is:");
        filesMapInRootDir.forEach((k, v) -> logger.info("k is {},v is {}", k, v));
        logger.info("sub dir file is:");
        filesMapInSubDir.forEach((k, v) -> logger.info("k is {},v is {}", k, v));
    }

    @Test
    public void testSys() {
        File source = new File("D:\\tq_workspace\\client3\\out\\artifacts\\client3\\bundles\\client3\\app",
                               "opencv_java_64bit.dll");
        File dest = new File("D:\\tq_workspace\\client3\\out\\artifacts\\client3\\bundles\\client3\\app\\dll",
                             "opencv_java.dll");
        boolean copyFile = FileUtils.copyFile(source, dest);
        logger.info("copy: " + copyFile);
        //System.out.println("arch: " + SystemUtils.getArc());
    }

    @Test
    public void testNet() {
        try {
            ResponseBody responseBody = Network.getAicApi()
                                               .pingServer()
                                               .execute()
                                               .body();
            ClientMsg clientMsg = GsonUtils.parseResponseToObj(responseBody);
            logger.info("client msg {}", clientMsg);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    @Test
    public void testDownLoad() {
        String downloadUrl = "/home/tqhy/aic/file/15cc97aaa6964fc5b6caf00020d575a4/20190517174054644/b798abe6e1b1318ee36b0dcb3fb9e4d3/fd9c69eb905feede1a7fc2fdfcf0fbdb.jpg";

        Network.getAicApi()
               .download(downloadUrl)
               //.observeOn(Schedulers.io())
               //.subscribeOn(Schedulers.io())
               .subscribe(response -> {
                   String header = response.headers().get("Content-Disposition");
                   logger.info("header is {}", header);
                   String[] split = header.split("filename=");
                   String fileName = split[1];
                   File file = new File("C:\\Users\\qing\\Pictures\\shadow", fileName);

                   BufferedSink sink = null;
                   try {
                       sink = Okio.buffer(Okio.sink(file));
                       sink.writeAll(response.body().source());
                       sink.close();
                   } catch (FileNotFoundException e) {
                       e.printStackTrace();
                   } catch (IOException e) {
                       e.printStackTrace();
                   }
               });
        //logger.info("response is: {}", response.string());
    }

    @Test
    public void testJson() {
        String str = "download;{\"fileName\":\"猫猫狗狗\",\"imgUrlString\":\"/home/tqhy/tf/train/dd6e323d1eee4487be6034ea383e053c/validate_img_result/1000/1679091c5a880faf6fb5e6087eb1b2dc.jpg;/home/tqhy/tf/train/dd6e323d1eee4487be6034ea383e053c/validate_img_result/1000/8e296a067a37563370ded05f5a3bf3ec.jpg\"}";
        String replace = str.replace("download;", "");
        logger.info("replace is {}", replace);
        JsonReader jsonReader = new JsonReader(new StringReader(replace));
        jsonReader.setLenient(true);
        DownloadInfo downloadInfo = new Gson().fromJson(jsonReader, DownloadInfo.class);
        logger.info("download info is: {}", downloadInfo);

        String json = "{\"flag\":1,\"data\":[{\"id\":\"60921c68d5ef4ec1a9ed833fe2e0834b\",\"delFlag\":0,\"createTime\":1566888675000,\"updateTime\":1566888726000,\"createUser\":\"阴景洲\",\"updateUser\":null,\"name\":\"肺结节\",\"remark\":\"肺结节2万\",\"taskId\":\"7c8f5f93b54846a7896856ca9b92dd41\",\"stepNum\":20000,\"state\":2,\"modelPath\":\"/mnt/data/model/7c8f5f93b54846a7896856ca9b92dd41/60921c68d5ef4ec1a9ed833fe2e0834b\",\"projectId\":\"3f59a5ebdc32487998bfcad7fd263953\",\"projectName\":\"人工智能识别肺结节\"}],\"msg\":[\"操作成功\"]}";
        ModelMsg<Model> msg = new Gson().fromJson(json, new TypeToken<ModelMsg<Model>>() {
        }.getType());
        List<Model> models = msg.getData();
        for (Model model : models) {
            logger.info("model name {}, model id {}", model.getName(), model.getId());
        }
    }

    @Test
    public void testFetchData() {
        long dateMills = 1546444800000L;
        long timeMills = 6588000L;


        logger.info("datetime is {}", DateUtils.getDatetimeFromMills(dateMills + timeMills));
    }

    public static void main(String[] args) {
        String imgPath = "C:\\Users\\qing\\Pictures\\北医三院\\eccbc87e4b5ce2fe28308fd9f2a7baf3\\eccbc87e4b5ce2fe28308fd9f2a7baf3.jpg";
        String data = JnaCaller.fetchData(imgPath, 2177, 158, 86, 20);
        System.out.println("fetch data: " + data);
    }
}
