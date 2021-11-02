import React from 'react'
import { ImageStyle, View, ViewStyle, Image, ImageProps, Dimensions, FlatList } from 'react-native';
import { FileListProps } from './list-file.props';
import { color, spacing } from '../../theme';
import { Text } from "../text/text";
import { IFileObject } from '../../services/api';
import Ionicons from 'react-native-vector-icons/Ionicons'

interface NewFileObject extends IFileObject {
  fileType?: string
}
const IMG_STYLE: ImageStyle = { width: 40, height: 40, borderRadius: 5 }

const image_type: string[] = ['jpg', 'jpeg', 'png']
export function ListFile(props: FileListProps) {

  const { list } = props

  const _getNewList = (tmpFileObject: IFileObject[]) => {
    if (tmpFileObject) {
      const newList: NewFileObject[] = tmpFileObject.map((e, i) => {
        let tmpFileName: string[] = e.file_name.split('.')
        let fileType = tmpFileName[tmpFileName.length - 1]
        if (image_type.find(imgType => imgType == fileType)) return { ...e, fileType: 'image' }
        else return { ...e, fileType: fileType }
      })
      return newList
    } else return []
  }

  const renderItem = ({ item, index }) => {
    return <Text text={item.file_name}></Text>
  }

  const newListItems: NewFileObject[] = _getNewList(JSON.parse(JSON.stringify(list)))

  return (
    <View>
      {newListItems.map((e, i) => {
        return <View style={{ flexDirection: 'row', paddingTop: 5 }} key={`list-file-root-${i}`}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {e.fileType == "image" ? <Image source={{ uri: e.url }} style={IMG_STYLE} /> :
              <Ionicons name={"document-outline"} size={40} />}
            <Text key={'file-tx-' + i} text={e.file_name} style={{ paddingLeft: 10 }} />
          </View>
        </View>
      })}
    </View>
  )
}
