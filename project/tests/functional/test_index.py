from .utils import SeleniumTest


class TestRegister(SeleniumTest):
    # assume that we are passed registration and should be on /dashboard/
    def test_successful_registration(self):
        driver = self.driver
        self.assertEqual(self.base_url+'/dashboard/', driver.current_url)
        self.assertEqual(
            "My greetings, {user_name}".format(user_name=self.user_id),
            driver.find_element_by_css_selector("p.navbar-text").text,
        )
