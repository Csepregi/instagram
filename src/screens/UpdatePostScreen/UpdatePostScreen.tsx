import React, { useEffect, useState } from "react";
import { Text, Image, StyleSheet, TextInput, View, ActivityIndicator } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import {  UpdatePostRouteProp } from "../../types/navigation";
import colors from "../../theme/colors";
import {  useMutation, useQuery } from "@apollo/client";
import { useAuthContext } from "../../context/AuthContext";
import CustomButton from "../Auth/components/CustomButton";
import { getPost, updatePost } from "./queries";
import ApiErrorMessage from "../../components/ApiErrorMessage";
import { GetPostQuery, GetPostQueryVariables, UpdatePostMutation, UpdatePostMutationVariables } from "../../API";
import PostMenu from "../../components/FeedPost/PostMenu";
import Navigation from "../../navigation";

const UpdatePostScreen = () => {
    const navigation = useNavigation();
    const [description, setDescription] = useState('');
    const route = useRoute<UpdatePostRouteProp>();
    const {userId} = useAuthContext()
    const {id} = route.params;
    
    const {data, loading, error} = useQuery<GetPostQuery, GetPostQueryVariables>(getPost, {variables: {id}})
    
    const [doUpdatePost, {error: updateError, data: updateData}] = useMutation<UpdatePostMutation, UpdatePostMutationVariables>(updatePost)

    const post = data?.getPost;

    const submit = async () => {
        if(!post) return
        const response = doUpdatePost({variables: {input: {id: post.id, description}}})

    }

    useEffect(() => {
        if (post) {
            setDescription(post?.description || '');
        }
    }, [post])

    useEffect(() => {
        if (updateData) {
            navigation.goBack();
        }
    }, [updateData, navigation])


    if(loading) {
        return <ActivityIndicator />
    }

    if (error) {
        return <ApiErrorMessage title='Failed to fetch the post' message={error?.message || updateError?.message} />
    }

    return (
        <View style={styles.root}>
            
            <TextInput value={description} onChangeText={setDescription} placeholder="Description..." style={styles.input} multiline numberOfLines={5} />
            <CustomButton text='Submit' onPress={submit} />
        </View>
    )
    }

    const styles = StyleSheet.create({
        root: {
            alignItems: 'center',
            padding: 10,
        },
        content: {
            width: '100%',
            aspectRatio: 3/2,
        },
        image: {
            width: 200,
            height: 200,
        },
        input: {
            marginVertical: 10,
            alignSelf:'stretch',
            backgroundColor: colors.white,
            padding: 10,
            borderRadius: 5,
        }
    })

    export default UpdatePostScreen;