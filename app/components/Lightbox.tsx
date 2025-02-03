import React, { useState, useRef } from "react";
import {
  View,
  Image,
  Modal,
  PanResponder,
  Dimensions,
  StyleSheet,
  GestureResponderEvent,
  PanResponderGestureState,
  ImageSourcePropType,
  Pressable,
} from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

interface ImageLightboxProps {
  source: ImageSourcePropType;
  closeModal: Function;
}

const ImageLightbox: React.FC<ImageLightboxProps> = ({
  source,
  closeModal,
}) => {
  const [scale, setScale] = useState(1);
  const [translateX, setTranslateX] = useState(0);
  const [translateY, setTranslateY] = useState(0);
  const [imageDimensions] = useState({
    width: 0,
    height: 0,
  });

  const baseScale = useRef(1);
  const initialDistance = useRef(0);
  const initialX = useRef(0);
  const initialY = useRef(0);

  const calculateMaxTranslate = () => {
    if (!imageDimensions.width || !imageDimensions.height)
      return { maxX: 0, maxY: 0 };

    const scaledWidth = imageDimensions.width * scale;
    const scaledHeight = imageDimensions.height * scale;

    const maxX = Math.max(0, (scaledWidth - SCREEN_WIDTH) / 2);
    const maxY = Math.max(0, (scaledHeight - SCREEN_HEIGHT) / 2);

    return { maxX, maxY };
  };

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderGrant: (e: GestureResponderEvent) => {
      const touches = e.nativeEvent.touches;
      if (touches.length === 2) {
        const touch1 = touches[0];
        const touch2 = touches[1];
        const distance = Math.hypot(
          touch2.pageX - touch1.pageX,
          touch2.pageY - touch1.pageY
        );
        initialDistance.current = distance;
        baseScale.current = scale;
      } else {
        initialX.current = translateX;
        initialY.current = translateY;
      }
    },
    onPanResponderMove: (
      e: GestureResponderEvent,
      gesture: PanResponderGestureState
    ) => {
      const touches = e.nativeEvent.touches;

      if (touches.length === 2) {
        const touch1 = touches[0];
        const touch2 = touches[1];
        const distance = Math.hypot(
          touch2.pageX - touch1.pageX,
          touch2.pageY - touch1.pageY
        );

        const newScale =
          (distance / initialDistance.current) * baseScale.current;
        setScale(Math.min(Math.max(newScale, 1), 3));
      } else if (touches.length === 1 && scale > 1) {
        const { maxX, maxY } = calculateMaxTranslate();
        const newX = initialX.current + gesture.dx;
        const newY = initialY.current + gesture.dy;

        setTranslateX(Math.min(Math.max(newX, -maxX), maxX));
        setTranslateY(Math.min(Math.max(newY, -maxY), maxY));
      }
    },
    onPanResponderRelease: () => {
      if (scale < 1) {
        setScale(1);
        setTranslateX(0);
        setTranslateY(0);
      }
    },
  });

  return (
    <Modal visible={true} transparent={true}>
      <View style={styles.modalContainer}>
        <Pressable style={styles.closeButton} onPress={() => closeModal()}>
          <AntDesign name="close" size={24} color="black" />
        </Pressable>

        <View style={styles.imageContainer} {...panResponder.panHandlers}>
          <Image
            source={source}
            style={[
              styles.fullImage,
              {
                transform: [
                  { translateX: translateX },
                  { translateY: translateY },
                  { scale: scale },
                ],
              },
            ]}
            resizeMode="contain"
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  thumbnail: {
    width: 100,
    height: 100,
    borderRadius: 8,
    margin: 10,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  imageContainer: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    justifyContent: "center",
    alignItems: "center",
  },
  fullImage: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
  closeButton: {
    position: "absolute",
    top: 60,
    right: 20,
    width: 30,
    height: 30,
    zIndex: 20000,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 100,
  },
});

export default ImageLightbox;
