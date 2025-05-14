from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager
import time
import pytest

# Fixture to set up and tear down the WebDriver
@pytest.fixture
def driver():
    # Automatically install and set up ChromeDriver
    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()))
    driver.maximize_window()
    yield driver
    driver.quit()

def test_register(driver):
    driver.get("http://localhost:3000/register")  # Adjust URL if different
    wait = WebDriverWait(driver, 10)
    
    # Fill registration form
    username_field = wait.until(EC.presence_of_element_located((By.ID, "name")))
    username_field.send_keys("Ngô Phúc Trường")
    
    email_field = driver.find_element(By.ID, "email")
    email_field.send_keys("truongngo1309@gmail.com")
    
    password_field = driver.find_element(By.ID, "password")
    password_field.send_keys("12345678")

    confirm_password_field = driver.find_element(By.ID, "confirm-password")
    confirm_password_field.send_keys("12345678")

    time.sleep(2)  # Wait for 2 seconds to simulate user typing
    
    # Submit registration form
    register_button = driver.find_element(By.ID, "register-button")
    register_button.click()
    
    # Wait for pop-up to appear and verify it is displayed
    popup = wait.until(EC.visibility_of_element_located((By.ID, "success-register-dialog")))
    assert popup.is_displayed(), "Pop-up did not appear after successful registration"
    time.sleep(5)