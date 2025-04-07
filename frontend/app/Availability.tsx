import React, { useState, useEffect } from "react";
import { Button, Switch, TextInput, Card, Divider } from "react-native-paper";
import styled from "styled-components/native";
import axios from "axios";
import { View } from "react-native";

// Styled Components (Updated to Match Dashboard Theme)
const Container = styled.ScrollView`
  padding: 24px;
  background-color: #f0f2f5;
`;

const Section = styled(Card)`
  margin-bottom: 24px;
  padding: 20px;
  background-color: #ffffff;
  border-radius: 16px;
  elevation: 5;
`;

const Label = styled.Text`
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 8px;
  color: #333;
`;

const StyledInput = styled(TextInput).attrs({
  mode: "outlined",
})`
  flex: 1;
  margin: 0 5px;
  background-color: #ffffff;
  border-radius: 10px;
`;

const TimeSlotContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-top: 10px;
  margin-bottom: 20px;
`;

const DayContainer = styled.View`
  margin-bottom: 12px;
  padding-bottom: 10px;
  border-bottom-width: 1px;
  border-color: #ddd;
`;

const StyledButton = styled(Button).attrs({
  contentStyle: { paddingVertical: 10 },
  labelStyle: { fontSize: 16, fontWeight: "bold", color: "white" },
})`
  margin-top: 15px;
  background-color: #6d28d9;
  border-radius: 12px;
`;

export default function Availability() {
  const [availability, setAvailability] = useState({
    monday: { available: false, startTime: "", endTime: "" },
    tuesday: { available: false, startTime: "", endTime: "" },
    wednesday: { available: false, startTime: "", endTime: "" },
    thursday: { available: false, startTime: "", endTime: "" },
    friday: { available: false, startTime: "", endTime: "" },
    saturday: { available: false, startTime: "", endTime: "" },
    sunday: { available: false, startTime: "", endTime: "" },
  });

  const [savedAvailability, setSavedAvailability] = useState(null);

  useEffect(() => {
    axios
      .get("http://10.16.64.177:5000/api/availability")
      .then((response) => {
        setAvailability(response.data || {});
        setSavedAvailability(response.data || {});
      })
      .catch((error) => {
        console.error("Error fetching availability data:", error);
      });
  }, []);

  const handleSaveAvailability = () => {
    axios
      .post("http://localhost:5000/api/availability", availability)
      .then(() => {
        alert("Availability schedule saved successfully!");
        setSavedAvailability(availability);
      })
      .catch((error) => {
        console.error("Error saving availability:", error);
        alert("There was an error saving the availability.");
      });
  };

  const handleToggleAvailability = (day) => {
    setAvailability({
      ...availability,
      [day]: {
        ...availability[day],
        available: !availability[day].available,
      },
    });
  };

  const handleTimeChange = (day, type, value) => {
    setAvailability({
      ...availability,
      [day]: {
        ...availability[day],
        [type]: value,
      },
    });
  };

  return (
    <Container>
      <Section>
        <Card.Title
          title="🗓 Set Your Weekly Availability"
          titleStyle={{ fontSize: 22, fontWeight: "bold", color: "#6D28D9" }}
        />
        <Divider style={{ marginVertical: 10 }} />

        {Object.keys(availability).map((day) => (
          <DayContainer key={day}>
            <Label>{day.charAt(0).toUpperCase() + day.slice(1)}:</Label>
            <Switch
              value={availability[day].available}
              onValueChange={() => handleToggleAvailability(day)}
            />
            {availability[day].available && (
              <TimeSlotContainer>
                <StyledInput
                  placeholder="Start Time"
                  value={availability[day].startTime}
                  onChangeText={(text) => handleTimeChange(day, "startTime", text)}
                />
                <StyledInput
                  placeholder="End Time"
                  value={availability[day].endTime}
                  onChangeText={(text) => handleTimeChange(day, "endTime", text)}
                />
              </TimeSlotContainer>
            )}
          </DayContainer>
        ))}

        <StyledButton mode="contained" onPress={handleSaveAvailability}>
          Save Schedule
        </StyledButton>
      </Section>

      {savedAvailability && (
        <Section>
          <Card.Title
            title="📅 Your Saved Schedule"
            titleStyle={{ fontSize: 20, fontWeight: "bold", color: "#6D28D9" }}
          />
          <Divider style={{ marginVertical: 10 }} />

          {Object.entries(savedAvailability).map(([day, data]) => (
            <View key={day} style={{ marginBottom: 10 }}>
              <Label>
                {day.charAt(0).toUpperCase() + day.slice(1)}:{" "}
                {data.available ? `${data.startTime} - ${data.endTime}` : "Not Available"}
              </Label>
            </View>
          ))}
        </Section>
      )}
    </Container>
  );
}
