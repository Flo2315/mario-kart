function spriteEasyWidth(sprite) 
{
	return sprite["spriteSheet"]["_frameWidth"] * sprite.scaleX;
}

function spriteEasyHeight(sprite) 
{
	return sprite["spriteSheet"]["_frameHeight"] * sprite.scaleY;
}

function spriteEasyPivotX(sprite) 
{
	return sprite["spriteSheet"]["_regX"] * sprite.scaleX;
}

function spriteEasyPivotY(sprite) 
{
	return sprite["spriteSheet"]["_regY"] * sprite.scaleY;
}