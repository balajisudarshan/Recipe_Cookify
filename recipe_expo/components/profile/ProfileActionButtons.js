import { View, Text ,TouchableOpacity,Dimensions} from 'react-native'
import React from 'react'
import { StyleSheet } from 'react-native'
import { Feather } from "@expo/vector-icons";
import { useAuth } from '../../context/AuthContext';

const { width, height } = Dimensions.get("window");

const ProfileActionButtons = () => {
    const {  handleLogout } = useAuth();
  return (
    <View style={styles.btnContainer}>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => navigation.navigate("EditProfile")}
          >
            <Feather
              name="edit-3"
              size={width * 0.04}
              color="#fff"
              style={{ marginRight: 6 }}
            />
            <Text style={styles.btnText} numberOfLines={1}>
              Edit Profile
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.shareBtn}>
            <Feather name="share-2" size={width * 0.045} color="#FF7A00" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
            <Feather
              name="log-out"
              size={width * 0.04}
              color="#EF4444"
              style={{ marginRight: 6 }}
            />
            <Text style={styles.logoutBtnText} numberOfLines={1}>
              Log Out
            </Text>
          </TouchableOpacity>
        </View>
  )
}

const styles = StyleSheet.create({
    btnContainer: {
    flexDirection: "row",
    width: width * 0.88,
    marginTop: height * 0.025,
    gap: width * 0.025,
    alignItems: "center",
  },
  editButton: {
    backgroundColor: "#FF7A00",
    flexDirection: "row",
    height: height * 0.055, // Heights tied strictly to screen runtime heights
    borderRadius: 12,
    flex: 2, // Takes up twice the space of the share block
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
  },
  logoutBtn: {
    backgroundColor: "#FEE2E2",
    borderWidth: 1,
    borderColor: "#FCA5A5",
    flexDirection: "row",
    height: height * 0.055,
    borderRadius: 12,
    flex: 2,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
  },
  btnText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: width * 0.036,
  },
  logoutBtnText: {
    color: "#EF4444",
    fontWeight: "700",
    fontSize: width * 0.036,
  },
  shareBtn: {
    width: height * 0.055, // Keeps it perfectly square with line heights
    height: height * 0.055,
    backgroundColor: "#FFF0E0",
    borderWidth: 1,
    borderColor: "#FF7A00",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
})

export default ProfileActionButtons