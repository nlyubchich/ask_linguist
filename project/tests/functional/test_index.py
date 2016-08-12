from project.tests.functional.utils import SeleniumTest


class TestRegister(SeleniumTest):
    # assume that we passed registration and should be on /dashboard/
    def test_successful_registration(self):
        driver = self.driver
        self.assertEqual(self.base_url+'/dashboard/French', driver.current_url)
        self.assertEqual(
            "{user_name}".format(user_name=self.user_id),
            driver.find_elements_by_class_name(
                "b-top-panel__item-user-info"
            )[0].text,
        )
