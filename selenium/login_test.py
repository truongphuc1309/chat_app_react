import pytest
from webdriver_manager.chrome import ChromeDriverManager

from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait
import time


# Fixture to set up and tear down the WebDriver
@pytest.fixture
def driver():
    # Automatically install and set up ChromeDriver
    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()))
    driver.maximize_window()
    yield driver
    driver.quit()

def test_login(driver):
    driver.get("http://localhost:3000/login")  # Adjust URL if different
    wait = WebDriverWait(driver, 10)
    
    # Fill login form
    username_field = wait.until(EC.presence_of_element_located((By.ID, "email")))
    username_field.send_keys("truongngo1309@gmail.com")
    
    password_field = driver.find_element(By.ID, "password")
    password_field.send_keys("12345678")
    
    time.sleep(2)
    # Submit login form
    login_button = driver.find_element(By.ID, "login-button")
    login_button.click()
    
    # Verify successful login (e.g., redirected to chat dashboard)
    wait.until(EC.url_to_be("http://localhost:3000/c"))
    
    # Verify successful login by checking the current URL
    current_url = driver.current_url
    assert current_url == "http://localhost:3000/c", f"Expected URL to be 'http://localhost:3000/c', but got '{current_url}'"
    time.sleep(5)
if __name__ == "__main__":
    pytest.main(["-v", __file__])