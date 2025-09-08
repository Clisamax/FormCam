import { Feather } from '@expo/vector-icons';
import { forwardRef, useEffect } from 'react';
import { Controller } from 'react-hook-form';
import { Text, TextInput, View, TouchableOpacity } from 'react-native';

import { ProductProps } from '@/@types/types';
import { styles } from './styles';
import { useState } from 'react';
import { produtosFormData } from '@/@types/types';

const InputProduct = forwardRef<TextInput, ProductProps>(
	
	({ icon, iconRight, formProps, inputProps = {}, error = '', style,  increment, decrement }, 
		ref ) => {

		return (
			<Controller
				render={({ field }) => (
					<View style={style}>
						<View style={styles.group}>
							<TouchableOpacity style={styles.icon} onPress={decrement}>
								<Feather name={icon} size={24} color="red" />
							</TouchableOpacity>
							<TextInput
								ref={ref}
								value={field.value}
								placeholder={field.value}
								onChangeText={field.onChange}
								style={styles.control}
								{...inputProps}
							/>
							{iconRight && (
								<TouchableOpacity style={styles.iconRight} onPress={increment}>
									<Feather name={iconRight} size={24} color="red" />
								</TouchableOpacity>
							)}
						</View>
						{error && error.length > 0 && (
							<Text style={styles.error}>{error}</Text>
						)}
					</View>
				)}
				{...formProps}
			/>
		);
	},
);
export default InputProduct;


