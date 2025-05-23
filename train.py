import tensorflow as tf
from tensorflow.keras.utils import image_dataset_from_directory
from tensorflow.keras import layers, models
# Load training dataset
train_ds = image_dataset_from_directory(
    "train",                # Path to the train folder
    image_size=(48, 48),    # FER standard size
    color_mode="grayscale", # Since FER images are grayscale
    batch_size=32,
    label_mode="categorical",  # For one-hot labels
    shuffle=True,
    seed=123
)

# Optionally split into train/val manually if no val folder
val_ds = train_ds.take(100)
train_ds = train_ds.skip(100)

# Prefetch for performance
AUTOTUNE = tf.data.AUTOTUNE
train_ds = train_ds.prefetch(buffer_size=AUTOTUNE)
val_ds = val_ds.prefetch(buffer_size=AUTOTUNE)

num_classes = 7  # angry, disgust, fear, happy, neutral, sad, surprise

model = models.Sequential([
    layers.Input(shape=(48, 48, 1)),

    layers.Conv2D(32, (3, 3), activation='relu'),
    layers.MaxPooling2D((2, 2)),

    layers.Conv2D(64, (3, 3), activation='relu'),
    layers.MaxPooling2D((2, 2)),

    layers.Conv2D(128, (3, 3), activation='relu'),
    layers.MaxPooling2D((2, 2)),

    layers.Flatten(),
    layers.Dense(128, activation='relu'),
    layers.Dropout(0.5),
    layers.Dense(num_classes, activation='softmax')
])

model.compile(
    optimizer='adam',
    loss='categorical_crossentropy',
    metrics=['accuracy']
)


history = model.fit(
    train_ds,
    validation_data=val_ds,
    epochs=20
)

model.save("emotion_model.h5")
model.summary()
