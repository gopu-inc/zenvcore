#!/usr/bin/env python3
"""
setup.py pour zenv[core]
"""
from setuptools import setup
import os
import re

def get_version():
    with open('zenv/__init__.py', 'r') as f:
        content = f.read()
        match = re.search(r'__version__\s*=\s*[\'"]([^\'"]+)[\'"]', content)
        if match:
            return match.group(1)
    return '1.0.0'

def get_long_description():
    """Lire le README.md"""
    try:
        with open('README.md', 'r', encoding='utf-8') as f:
            return f.read()
    except:
        return "Zenv Package Manager - Core functionality with znv CLI"

setup(
    name="ZenvCore",
    version=get_version(),
    author="Gopu.Inc",
    author_email="ceoseshell@gmail.com",
    description="Zenv Package Manager - Core functionality with znv CLI",
    long_description=get_long_description(),
    long_description_content_type="text/markdown",
    url="https://github.com/gopu-inc/zenvcore",
    packages=['zenv'],
    install_requires=[
        'requests>=2.28.0',
        'toml>=0.10.2',
    ],
    entry_points={
        'console_scripts': [
            'znv=zenv.cli:main',  # Alias
        ],
    },
    classifiers=[
        'Development Status :: 4 - Beta',
        'Intended Audience :: Developers',
        'Topic :: Software Development :: Build Tools',
        'License :: OSI Approved :: MIT License',
        'Programming Language :: Python :: 3',
        'Programming Language :: Python :: 3.7',
        'Operating System :: OS Independent',
        'Environment :: Console',
    ],
    python_requires='>=3.7',
    keywords='package-manager, zenv, package, distribution, cli',
    license='MIT',
)
