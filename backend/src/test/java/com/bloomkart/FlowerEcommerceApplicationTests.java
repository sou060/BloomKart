package com.bloomkart;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;

@Import(TestMailConfig.class)
@SpringBootTest
class FlowerEcommerceApplicationTests {

    @Test
    void contextLoads() {
    }

}
