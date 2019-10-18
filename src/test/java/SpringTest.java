import com.tqhy.client.ClientApplication;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

/**
 * @author Yiheng
 * @create 4/2/2019
 * @since 1.0.0
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = ClientApplication.class)
public class SpringTest {

    Logger logger = LoggerFactory.getLogger(SpringTest.class);

    @Test
    public void test() {
        logger.info("spring test...");
    }


}
