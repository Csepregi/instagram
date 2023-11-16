import {ActivityIndicator, FlatList} from 'react-native';
import users from '../../assets/data/users.json';
import UserListItem from '../../components/UserListItem';
import { useQuery } from '@apollo/client';
import {listUsers}  from './queries';
import { ListUsersQuery, ListUsersQueryVariables } from '../../API';
import ApiErrorMessage from '../../components/ApiErrorMessage';

const UsersSearchScreen = () => {

  const {data, loading, error, refetch} = useQuery<ListUsersQuery, ListUsersQueryVariables>(listUsers)
  console.log('list users ', data)

  if (loading) {
    return <ActivityIndicator />
  }
  if (error) {
    return (
      <ApiErrorMessage title="Error fetching users" message={error.message} />
    )
  }

  //const users = (data?.listUsers?.items || []).filter(user => user && !user._deleted);
  const users = (data?.listUsers?.items || [])

  return (
    <FlatList
      data={users}
      renderItem={({item}) => item && <UserListItem user={item} />}
      onRefresh={() => refetch()}
      refreshing={loading}
    />
  );
};

export default UsersSearchScreen;
