import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from "react-native";
import Header from "../components/Header";
import { useState } from "react";
import { LAYOUT_STATES } from "../utils/layout";
import { DEFAULT_POSTS } from "../utils/posts";
import { Items } from "../components/Items";
import { ImageSourcePropType } from "react-native";
import ImageLightbox from "../components/Lightbox";

const screenWidth = Dimensions.get("window").width;

export default function Home() {
  const [selectedTab, setSelectedTab] = useState(0);
  const [layoutStates, setLayoutStates] = useState([...LAYOUT_STATES]);
  const [posts] = useState([...DEFAULT_POSTS]);
  const [imageSource, setImageSource] = useState<ImageSourcePropType | null>(
    null
  );

  const handleScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const pageIndex = Math.round(
      event.nativeEvent.contentOffset.x / screenWidth
    );
    setSelectedTab(pageIndex);
  };

  return (
    <SafeAreaView style={[homeStyles.homeContainer]}>
      <Header
        selectedTab={selectedTab}
        layoutStates={layoutStates}
        setLayoutStates={setLayoutStates}
      />
      {imageSource ? (
        <ImageLightbox
          source={imageSource}
          closeModal={() => setImageSource(null)}
        />
      ) : null}
      <ScrollView
        horizontal
        pagingEnabled
        onMomentumScrollEnd={handleScrollEnd}
        showsHorizontalScrollIndicator={false}
      >
        <Items
          setImageSource={setImageSource}
          posts={posts}
          layoutState={layoutStates.find((t) => t.selected)!}
        />
        <Items
          setImageSource={setImageSource}
          posts={[...posts]
            .filter((t) => t.caption)
            .sort((a, b) => b.imageId.localeCompare(a.imageId))}
          layoutState={layoutStates.find((t) => t.selected)!}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const homeStyles = StyleSheet.create({
  homeContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
