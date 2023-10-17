import React, { FC, useState, useEffect } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "@utils/ResponsiveScreen";
import { themeArr } from "@themes/Themes.js";
import Header from "@header/Header";
import { Strings } from "@res/Strings.js";
import { getStateBorderData } from "@jobPreferences/JobPreferencesActions";
import Icon from "react-native-vector-icons/Ionicons";
import EntypoIcon from "react-native-vector-icons/Entypo";
import FontIcon from "react-native-vector-icons/FontAwesome5";
import MapView, {
  PROVIDER_GOOGLE,
  Circle,
  Polygon,
  Polyline,
} from "react-native-maps";
import { useDispatch, useSelector } from "react-redux";
import ResponseModal from "@responseModal/ResponseModal";
import { saveLocationMapShapes } from "@jobPreferences/JobPreferencesActions";

interface MapInterface {
  title: string;
  navigation: any;
}

let id = 0;

const MapClass: FC<MapInterface> = (props: any) => {
  const dispatch = useDispatch();
  const { white, secondaryColor, black, dangerColor } = themeArr.common;
  const { mapSelectionBg, iconDisabled, polygonFillColor } = themeArr.map;
  const {
    DEATIL_LOCATION_SELECTION,
    CONFIRM,
    CLEAR_MAP_SHAPES,
    CLEAR,
    DONT_CLEAR,
    API_ERROR,
  } = Strings;

  let locationData: any = {};
  if (props?.route?.params && props?.route?.params?.location) {
    locationData = props.route.params.location;
  } else {
    props.navigation.goBack();
  }

  const everythingElse = [
    {
      latitude: 74.693404,
      longitude: -173.993947,
    },
    {
      latitude: -8.559294,
      longitude: -168.793038,
    },
    {
      latitude: 6.162401,
      longitude: -50.719684,
    },
    {
      latitude: 74.549185,
      longitude: -50.016866,
    },
  ];

  const initialRegion = {
    latitude: locationData.points[0].geoPoints[0].latitude,
    longitude: locationData.points[0].geoPoints[0].longitude,
    latitudeDelta: 10,
    longitudeDelta: 10,
  };

  const [stateBorder, setStateBorder] = useState<any>(null);
  const [pointerSelection, setPointerSelection] = useState("");
  const [pointerSelectionIndex, setPointerSelectionIndex] = useState(-1);
  const [polygonCreate, setPolygonCreate] = useState(false);
  const [circleCreate, setCircleCreate] = useState(false);
  const [polylines, setPolylines] = useState<any>([]);
  const [circles, setCircles] = useState<any>([]);
  const [createCircleObj, setCreateCircleObj] = useState<any>(null);
  const [editing, setEditing] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);

  const isStateLocationLoading = useSelector(
    (state: any) => state.JobPreferenceReducer.isStateLocationLoading
  );
  const isMapShapesLoading = useSelector(
    (state: any) => state.JobPreferenceReducer.isMapShapesLoading
  );

  useEffect(() => {
    dispatch(getStateBorderData(locationData.stateId, stateBorderResponse));
    const polygonArray: any = [];
    const circleArray: any = [];
    locationData.points.map((item: any) => {
      if (item.type === "Polygon") {
        polygonArray.push(item);
      } else if (item.type === "Circle") {
        circleArray.push(item);
      }
    });
    setPolylines(polygonArray);
    setCircles(circleArray);
  }, []);

  const savingShapesResp = (isSuccess: boolean) => {
    if (isSuccess) {
      props.navigation.goBack();
    } else {
      Alert.alert(API_ERROR);
    }
  };

  const finish = () => {
    const payload = {
      stateId: locationData.stateId,
      shape: polylines.concat(circles),
    };
    dispatch(saveLocationMapShapes(payload, savingShapesResp));
  };

  const stateBorderResponse = (isSuccess: boolean, response: any) => {
    if (isSuccess) {
      const pointArray: any = response.geoShapes;
      const gPoints: any = [];
      gPoints.push([...everythingElse].reverse());
      pointArray.map((sh: any) => {
        const gPoint: any = [];
        sh.geoPoints.map((point: any) => {
          gPoint.push({
            latitude: point.latitude,
            longitude: point.longitude,
          });
        });
        gPoints.push(gPoint);
      });
      setStateBorder(gPoints);
    }
  };

  const onPanDrag = (e: any) => {
    if (!editing) {
      setEditing({
        id: id++,
        geoPoints: [e.nativeEvent.coordinate],
      });
    } else {
      setEditing({
        ...editing,
        geoPoints: [...editing.geoPoints, e.nativeEvent.coordinate],
      });
    }
  };

  const renderStateNameHeader = () => {
    return (
      <View
        style={[
          styles.stateNameView,
          {
            backgroundColor: secondaryColor,
          },
        ]}
      >
        <Text
          style={[
            styles.stateNameText,
            {
              color: white,
            },
          ]}
        >
          {locationData.stateName}
        </Text>
      </View>
    );
  };

  const renderPolygons = () => {
    return polylines.map((polyline: any, index: number) => {
      return (
        <Polygon
          key={String(index)}
          tappable
          onPress={() => {
            setPointerSelection("polygon");
            setPointerSelectionIndex(index);
          }}
          coordinates={polyline.geoPoints}
          strokeColor={
            pointerSelection === "polygon" && pointerSelectionIndex === index
              ? dangerColor
              : black
          }
          fillColor={polygonFillColor}
          strokeWidth={
            pointerSelection === "polygon" && pointerSelectionIndex === index
              ? 3
              : 1
          }
        />
      );
    });
  };

  const renderCircles = () => {
    return circles.map((circleArray: any, index: number) => {
      return (
        <Circle
          key={String(index)}
          radius={parseFloat(circleArray.radius) / 0.00062137}
          center={circleArray.geoPoints[0]}
          strokeColor={
            pointerSelection === "circle" && pointerSelectionIndex === index
              ? dangerColor
              : black
          }
          fillColor={polygonFillColor}
          strokeWidth={
            pointerSelection === "circle" && pointerSelectionIndex === index
              ? 3
              : 1
          }
          zIndex={999}
        />
      );
    });
  };

  const renderStateBorderView = () => {
    return (
      stateBorder &&
      stateBorder.map((item: any, index: number) => {
        return (
          <Polyline
            key={String(index)}
            coordinates={item}
            strokeColor={black}
            strokeWidth={1}
            zIndex={999}
          />
        );
      })
    );
  };

  const renderBottomView = () => {
    return (
      <View
        style={[
          styles.iconMainView,
          {
            backgroundColor: mapSelectionBg,
          },
        ]}
      >
        <Icon
          onPress={() => {
            setShowModal(true);
          }}
          name="close-circle-outline"
          size={wp(8)}
          color={white}
        />
        <Icon
          onPress={() => {
            if (pointerSelection !== "" && pointerSelectionIndex !== -1) {
              if (pointerSelection === "polygon") {
                setPointerSelectionIndex(-1);
                setPointerSelection("");
                setTimeout(() => {
                  setPolygonCreate(false);
                  setEditing(null);
                  setCreateCircleObj(null);
                  const polygonArray = JSON.parse(JSON.stringify(polylines));
                  polygonArray.splice(pointerSelectionIndex, 1);
                  setPolylines(polygonArray);
                }, 300);
              } else if (pointerSelection === "circle") {
                setPointerSelectionIndex(-1);
                setPointerSelection("");
                setTimeout(() => {
                  setCircleCreate(false);
                  setEditing(null);
                  setCreateCircleObj(null);
                  const circleArray = JSON.parse(JSON.stringify(circles));
                  circleArray.splice(pointerSelectionIndex, 1);
                  setCircles(circleArray);
                }, 300);
              }
            }
          }}
          name="trash"
          size={wp(8)}
          style={styles.marginLeftThree}
          color={pointerSelection !== "" ? white : iconDisabled}
        />
        <FontIcon
          onPress={() => {
            setPointerSelection("");
            setPointerSelectionIndex(-1);
            setPolygonCreate(false);
            setCircleCreate(false);
            setEditing(null);
            setCreateCircleObj(null);
          }}
          name="hand-pointer"
          size={wp(8)}
          style={styles.marginLeftThree}
          color={white}
        />
        <EntypoIcon
          onPress={() => {
            if (circleCreate) {
              setCircleCreate(false);
              setEditing(null);
              setPolygonCreate(false);
              setCreateCircleObj(null);
              setPointerSelection("");
              setPointerSelectionIndex(-1);
            } else {
              setEditing(null);
              setCreateCircleObj(null);
              setPolygonCreate(false);
              setCircleCreate(true);
              setPointerSelection("");
              setPointerSelectionIndex(-1);
            }
          }}
          name="circle"
          size={wp(8)}
          style={styles.marginLeftThree}
          color={white}
        />
        <FontIcon
          onPress={() => {
            if (polygonCreate && editing) {
              const createdPolygon = JSON.parse(JSON.stringify(editing));
              delete createdPolygon.id;
              createdPolygon.type = "Polygon";
              createdPolygon.radius = null;
              setPolylines([...polylines, createdPolygon]);
              setPolygonCreate(false);
              setEditing(null);
              setCreateCircleObj(null);
              setPointerSelection("");
              setPointerSelectionIndex(-1);
            } else {
              setEditing(null);
              setCreateCircleObj(null);
              setCircleCreate(false);
              setPolygonCreate(true);
              setPointerSelection("");
              setPointerSelectionIndex(-1);
            }
          }}
          name="draw-polygon"
          size={wp(8)}
          style={styles.marginLeftThree}
          color={white}
        />
        <Icon
          onPress={() => finish()}
          name="checkmark-circle-outline"
          size={wp(8)}
          style={styles.marginLeftThree}
          color={white}
        />
      </View>
    );
  };

  const haversineDistance = (coords1: any, coords2: any, isMiles: boolean) => {
    function toRad(x: any) {
      return (x * Math.PI) / 180;
    }

    const lon1 = coords1.longitude;
    const lat1 = coords1.latitude;

    const lon2 = coords2.longitude;
    const lat2 = coords2.latitude;

    const R = 6371; // Radius of Earth in km

    const x1 = lat2 - lat1;
    const dLat = toRad(x1);
    const x2 = lon2 - lon1;
    const dLon = toRad(x2);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    let d = R * c;

    if (isMiles) d /= 1.60934;

    return d;
  };

  const onMapPress = async (event: any) => {
    if (polygonCreate && editing) {
      const createdPolygon = JSON.parse(JSON.stringify(editing));
      delete createdPolygon.id;
      createdPolygon.type = "Polygon";
      createdPolygon.radius = null;
      setPolylines([...polylines, createdPolygon]);
      setPolygonCreate(false);
      setEditing(null);
      setCreateCircleObj(null);
      setPointerSelection("");
      setPointerSelectionIndex(-1);
    } else if (
      circleCreate &&
      event &&
      event.nativeEvent &&
      event.nativeEvent.coordinate
    ) {
      if (createCircleObj) {
        const distance = await haversineDistance(
          createCircleObj,
          event.nativeEvent.coordinate,
          true
        );
        const obj = {
          type: "Circle",
          radius: distance,
          geoPoints: [createCircleObj],
        };
        const circleArray = JSON.parse(JSON.stringify(circles));
        circleArray.push(obj);
        setCircles(circleArray);
        setCircleCreate(false);
        setEditing(null);
        setPointerSelection("");
        setPointerSelectionIndex(-1);
        setCreateCircleObj(null);
      } else {
        setCreateCircleObj(event.nativeEvent.coordinate);
      }
    } else if (
      event &&
      event.nativeEvent &&
      event.nativeEvent.coordinate &&
      circles &&
      circles.length > 0
    ) {
      const coordinates = event.nativeEvent.coordinate;

      circles.map((array: any, index: number) => {
        const distance = haversineDistance(
          coordinates,
          array.geoPoints[0],
          true
        );
        if (distance <= array.radius) {
          setPointerSelection("circle");
          setPointerSelectionIndex(index);
        }
      });
    }
  };

  return (
    <Header
      showBack
      showLoader={isStateLocationLoading || isMapShapesLoading}
      title={DEATIL_LOCATION_SELECTION}
      navigation={props.navigation}
    >
      <View style={styles.flexOne}>
        {renderStateNameHeader()}
        <MapView
          provider={PROVIDER_GOOGLE}
          style={styles.flexOne}
          scrollEnabled={!(polygonCreate || circleCreate)}
          initialRegion={initialRegion}
          onPanDrag={(e: any) => (polygonCreate ? onPanDrag(e) : null)}
          onPress={onMapPress}
        >
          {renderPolygons()}
          {editing && (
            <Polyline
              key="editingPolyline"
              coordinates={editing.geoPoints}
              strokeColor={black}
              strokeWidth={1}
            />
          )}
          {renderCircles()}
          {renderStateBorderView()}
        </MapView>
      </View>
      {renderBottomView()}
      <ResponseModal
        title={CONFIRM}
        message={CLEAR_MAP_SHAPES}
        isSuccess={false}
        isModalVisible={showModal}
        btnOneTitle={DONT_CLEAR}
        btnTwoTitle={CLEAR}
        btnOnePress={() => {
          setShowModal(false);
        }}
        btnTwoPress={() => {
          setPolylines([]);
          setCircles([]);
          setShowModal(false);
        }}
      />
    </Header>
  );
};

const styles = StyleSheet.create({
  flexOne: {
    flex: 1,
  },
  stateNameView: {
    height: hp(7),
    width: "100%",
    justifyContent: "center",
  },
  stateNameText: {
    textAlign: "center",
    fontSize: wp(5),
    fontWeight: "800",
  },
  iconMainView: {
    flexDirection: "row",
    height: hp(8),
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  marginLeftThree: {
    marginLeft: wp(3),
  },
});

export default MapClass;
