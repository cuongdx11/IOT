import Header from "components/Headers/Header.js";
import React, { useState, useEffect } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Container,
  Row,
  Col,
  CustomInput,
} from "reactstrap";
import ChartComponent from "variables/charts.js";

const Index = (props) => {
  const [isLightOn, setLightOn] = useState(() => {
    // Kiểm tra localStorage để xem có trạng thái được lưu không
    const storedState = localStorage.getItem('lightStatus');
    return storedState ? JSON.parse(storedState) : false;
  });

  const [isFanOn, setFanOn] = useState(() => {
    const storedState = localStorage.getItem('fanStatus');
    return storedState ? JSON.parse(storedState) : false;
  });

  const [history, setHistory] = useState([]);
  const [fanStatusCount, setFanStatusCount] = useState({ on: 0, off: 0 });
  const [lightStatusCount, setLightStatusCount] = useState({ on: 0, off: 0 });

  useEffect(() => {
    // Gọi API để lấy số lượng ON/OFF từ server
    fetch('http://localhost:8000/api/count')
      .then(response => response.json())
      .then(data => {
        setFanStatusCount({ on: data.soLuongON_FAN, off: data.soLuongOFF_FAN });
        setLightStatusCount({ on: data.soLuongON_LIGHT, off: data.soLuongOFF_LIGHT });
      })
      .catch(error => {
        console.error('Error fetching status count:', error);
      });
  }, []); // useEffect sẽ chỉ chạy một lần sau khi component được render

  // Trong toggleLight
const toggleLight = () => {
  const newLightState = !isLightOn;
  const action = newLightState ? "Turned On" : "Turned Off";
  const device = "Light";
  const time = new Date().toLocaleString();

  // Lưu trạng thái và thao tác vào localStorage
  localStorage.setItem('lightStatus', JSON.stringify(newLightState));

  const historyItem = { action, device, time };
  const history = JSON.parse(localStorage.getItem("history")) || [];
  history.push(historyItem);
  localStorage.setItem("history", JSON.stringify(history));

  // Tăng giá trị ON/OFF trực tiếp trên giao diện
  setLightStatusCount(prevStatus => ({
    on: newLightState ? prevStatus.on + 1 : prevStatus.on,
    off: newLightState ? prevStatus.off : prevStatus.off + 1,
  }));

  setHistory([...history, historyItem]);
  setLightOn(newLightState);

  // Gọi API để bật hoặc tắt đèn
  fetch('http://localhost:8000/api/light', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ isLightOn: newLightState }),
  })
    .then(response => {
      if (response.status === 200) {
        // Xử lý khi gọi API thành công
        console.log('API call successful');
      } else {
        // Xử lý khi gọi API thất bại
        console.error('API call failed');
      }
    })
    .catch(error => {
      // Xử lý khi có lỗi xảy ra trong quá trình gọi API
      console.error('API call error:', error);
    });
};

// Tương tự cho toggleFan
const toggleFan = () => {
  const newFanState = !isFanOn;
  const action = newFanState ? "Turned On" : "Turned Off";
  const device = "Fan";
  const time = new Date().toLocaleString();

  // Lưu trạng thái và thao tác vào localStorage
  localStorage.setItem('fanStatus', JSON.stringify(newFanState));

  const historyItem = { action, device, time };
  const history = JSON.parse(localStorage.getItem("history")) || [];
  history.push(historyItem);
  localStorage.setItem("history", JSON.stringify(history));

  // Tăng giá trị ON/OFF trực tiếp trên giao diện
  setFanStatusCount(prevStatus => ({
    on: newFanState ? prevStatus.on + 1 : prevStatus.on,
    off: newFanState ? prevStatus.off : prevStatus.off + 1,
  }));

  setHistory([...history, historyItem]);
  setFanOn(newFanState);

  // Gọi API để bật hoặc tắt quạt
  fetch('http://localhost:8000/api/fan', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ isFanOn: newFanState }),
  })
    .then(response => {
      if (response.status === 200) {
        // Xử lý khi gọi API thành công
        console.log('API call successful');
      } else {
        // Xử lý khi gọi API thất bại
        console.error('API call failed');
      }
    })
    .catch(error => {
      // Xử lý khi có lỗi xảy ra trong quá trình gọi API
      console.error('API call error:', error);
    });
};


  const customInputStyle = {
    width: "60px",
    height: "30px",
    marginTop: "10px",
  };

  return (
    <>
      <Header />
      <Container className="mt--7" fluid>
        <Row>
          <Col className="mb-5 mb-xl-0" xl="8">
            <Card>
              <ChartComponent />
            </Card>
          </Col>
          <Col xl="4">
            <Card className="shadow">
              <CardHeader className="bg-transparent">
                <Row className="align-items-center">
                  <div className="col">
                    <h6 className="text-uppercase text-muted ls-1 mb-1">
                      Performance
                    </h6>
                    <h2 className="mb-0">Control Panel</h2>
                  </div>
                </Row>
              </CardHeader>
              <CardBody>
                <div>
                  <h4>Light</h4>
                  <p>ON: {lightStatusCount.on}</p>
                  <p>OFF: {lightStatusCount.off}</p>
                  <img
                    src={require(isLightOn
                      ? "assets/img/led_on.png"
                      : "assets/img/led_off.png")}
                    alt="Light"
                    style={{
                      maxWidth: "150px",
                      maxHeight: "150px",
                      marginLeft: "50px",
                    }}
                  />
                  <CustomInput
                    type="switch"
                    id="lightSwitch"
                    className="custom-switch custom-control-lg"
                    checked={isLightOn}
                    onChange={toggleLight}
                  />
                </div>
                <div className="mt-4">
                  <h4>Fan</h4>
                  <p>ON: {fanStatusCount.on}</p>
                  <p>OFF: {fanStatusCount.off}</p>
                  <img
                    src={require(isFanOn
                      ? "assets/img/fan_on.gif"
                      : "assets/img/fan_off.png")}
                    alt="Fan"
                    style={{ maxWidth: "200px", maxHeight: "200px" }}
                  />
                  <CustomInput
                    type="switch"
                    id="fanSwitch"
                    style={customInputStyle}
                    checked={isFanOn}
                    onChange={toggleFan}
                  />
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Index;
