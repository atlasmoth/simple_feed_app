import React from "react";
import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
  Dimensions,
  ImageSourcePropType,
} from "react-native";
import { LayoutState, Post } from "../utils/types";
import { imageMap } from "../utils/images";

const { width } = Dimensions.get("window");

interface ListItemProps {
  post: Post;
  layoutState: LayoutState;
  setImageSource: React.Dispatch<
    React.SetStateAction<ImageSourcePropType | null>
  >;
}

const ListItem: React.FC<ListItemProps> = ({
  post,
  layoutState,
  setImageSource,
}) => {
  const handlePress = () => {
    setImageSource(imageMap[post.imageId]);
  };

  const renderFeedLayout = () => (
    <Pressable style={styles.feedItemContainer} onPress={handlePress}>
      <Text style={[styles.selectedText, { marginHorizontal: 16 }]}>
        Created by {post.createdById}
      </Text>
      <Text
        style={[styles.optionText, { marginBottom: 10, marginHorizontal: 16 }]}
      >
        {post.caption}
      </Text>
      <Image
        source={imageMap[post.imageId]}
        style={styles.feedImage}
        resizeMode="cover"
      />
    </Pressable>
  );

  const renderGridLayout = () => (
    <Pressable style={styles.gridItemContainer} onPress={handlePress}>
      <Image
        source={imageMap[post.imageId]}
        style={styles.gridImage}
        resizeMode="cover"
      />
      <Text style={[styles.selectedText, styles.gridTextContainer]}>
        Created by {post.createdById}
      </Text>
    </Pressable>
  );

  const renderListLayout = () => (
    <Pressable style={styles.listItemContainer} onPress={handlePress}>
      <Image
        source={imageMap[post.imageId]}
        style={styles.listImage}
        resizeMode="cover"
      />
      <View style={styles.listTextContainer}>
        <Text style={[styles.selectedText, { marginBottom: 5 }]}>
          {post.imageId}
        </Text>
        <Text style={styles.optionText}>Created by {post.createdById}</Text>
      </View>
    </Pressable>
  );

  switch (layoutState.key) {
    case "FEED":
      return renderFeedLayout();
    case "GRID":
      return renderGridLayout();
    default:
      return renderListLayout();
  }
};

interface ItemsProps {
  posts: Post[];
  layoutState: LayoutState;
  setImageSource: React.Dispatch<
    React.SetStateAction<ImageSourcePropType | null>
  >;
}

export const Items: React.FC<ItemsProps> = ({
  posts,
  layoutState,
  setImageSource,
}) => {
  return (
    <FlatList
      contentContainerStyle={styles.listContainer}
      key={layoutState.key}
      numColumns={layoutState.key === "GRID" ? 2 : 1}
      showsVerticalScrollIndicator={false}
      style={styles.container}
      data={posts}
      renderItem={({ item }) => (
        <ListItem
          post={item}
          layoutState={layoutState}
          setImageSource={setImageSource}
        />
      )}
      keyExtractor={(item) => `${layoutState.key}-${item.postId}`}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContainer: {
    width,
  },

  listItemContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16,
    marginTop: 10,
    flex: 1,
  },
  feedItemContainer: {
    marginTop: 25,
    flex: 1,
  },
  gridItemContainer: {
    marginTop: 15,
    marginHorizontal: 10,
    flex: 1,
  },

  optionText: {
    color: "rgba(0,0,0,.4)",
  },
  selectedText: {
    color: "#000",
  },

  feedImage: {
    width: "100%",
    height: 350,
  },
  gridImage: {
    width: "100%",
    height: 170,
    borderRadius: 4,
  },
  listImage: {
    width: 50,
    height: 50,
  },

  gridTextContainer: {
    marginTop: 5,
  },
  listTextContainer: {
    marginLeft: 16,
  },
});
