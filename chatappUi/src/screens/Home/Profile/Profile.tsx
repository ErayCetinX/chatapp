import { View } from 'react-native';
import React from 'react';
import style from './ProfileStyle';
import FastImage from 'react-native-fast-image';
import { useQuery } from '@apollo/client';
import { getLoggedInUserDetailsQuery } from '../../../request/query';
import { Text } from '../../../components/ui';
import moment from 'moment';

interface Props {
  route: {
    params: {
      avatarUrl: string;
      username: string;
      email: string;
      createdAt: Date;
    };
  };
}

const Profile: React.FC<Props> = props => {
  const { avatarUrl, email, username, createdAt } = props.route?.params;

  return (
    <View style={style.container}>
      <View style={style.box}>
        <View style={style.imageContainer}>
          <FastImage
            source={{ uri: avatarUrl, priority: FastImage.priority.normal }}
            style={{ width: 75, height: 75, borderRadius: 99 }}
          />
        </View>
        <Text style={{ fontWeight: '700' }} text={username} />
        {/* Buraya moment ile tarihi fix biçime gir */}
        <Text
          text={`Joinged ${moment
            .utc(createdAt)
            .local()
            .startOf('D')
            .fromNow()}`}
        />
      </View>
    </View>
  );
};

export default Profile;
