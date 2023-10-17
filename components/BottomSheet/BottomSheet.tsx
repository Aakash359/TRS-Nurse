import React, { FC } from "react";
import RBSheet from "react-native-raw-bottom-sheet";
import { View } from "react-native";

interface BottomSheet {
  reference: any;
  children: any;
  closeOnDragDown: boolean;
  closeOnPressMask: boolean;
  height: number;
  customStyles: any;
}

const BottomSheet: FC<BottomSheet> = (props) => {
  const {
    reference,
    children = <View />,
    closeOnDragDown,
    closeOnPressMask,
    height,
    customStyles,
  } = props;

  return (
    <RBSheet
      ref={reference}
      closeOnDragDown={closeOnDragDown}
      closeOnPressMask={closeOnPressMask}
      height={height}
      customStyles={customStyles}
    >
      {children}
    </RBSheet>
  );
};

export default BottomSheet;
